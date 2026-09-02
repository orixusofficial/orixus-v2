# Orixus Ultimate Focus — Dedicated Privileged DNS Helper
# Safe, minimal PowerShell helper for applying and restoring Windows DNS configurations.
# STRICT USAGE:
#   orixus-dns-helper.ps1 --apply "C:\path\to\dns_snapshot.json"
#   orixus-dns-helper.ps1 --restore "C:\path\to\dns_snapshot.json"

[CmdletBinding()]
param (
    # NOTE: when launched via `powershell.exe -File ... --apply "path"`, the
    # -File parameter binder mis-parses `--apply` as a NAMED parameter and
    # fails with "A parameter cannot be found that matches parameter name
    # '-apply'". Collect ALL arguments positionally instead, then unpack them
    # below — this preserves the documented `--apply` / `--restore` CLI
    # contract while remaining compatible with the elevation invocation.
    [Parameter(Position = 0, ValueFromRemainingArguments = $true)]
    [string[]]$HelperArgs
)

$Action = if ($HelperArgs.Count -gt 0) { [string]$HelperArgs[0] } else { '' }
$SnapshotPath = if ($HelperArgs.Count -gt 1) { [string]$HelperArgs[1] } else { '' }

$ErrorActionPreference = 'Stop'
$StatusPath = "$SnapshotPath.status"

function Write-Status {
    param([string]$message)
    try {
        [System.IO.File]::WriteAllText($StatusPath, $message)
    } catch {}
}

function Get-ActiveAdapters {
    Get-NetAdapter | Where-Object { $_.Status -eq 'Up' -and $_.InterfaceDescription -notlike '*Virtual*' -notlike '*VPN*' -notlike '*Loopback*' }
}

try {
    if ($Action -eq '--apply') {
        if (-not $SnapshotPath) {
            Write-Status "ERROR: Snapshot path is required for --apply"
            exit 1
        }

        $activeAdapters = Get-ActiveAdapters
        if (-not $activeAdapters -or $activeAdapters.Count -eq 0) {
            Write-Status "ERROR: No active network adapters found"
            exit 1
        }

        $snapshotData = @{}

        foreach ($adapter in $activeAdapters) {
            $idx = $adapter.InterfaceIndex
            $dnsInfo = Get-DnsClientServerAddress -InterfaceIndex $idx -AddressFamily IPv4 -ErrorAction SilentlyContinue
            $dnsInfo6 = Get-DnsClientServerAddress -InterfaceIndex $idx -AddressFamily IPv6 -ErrorAction SilentlyContinue
            $ipConfig = Get-NetIPInterface -InterfaceIndex $idx -AddressFamily IPv4 -ErrorAction SilentlyContinue

            $origV4 = if ($dnsInfo) { @($dnsInfo.ServerAddresses) } else { @() }
            $origV6 = if ($dnsInfo6) { @($dnsInfo6.ServerAddresses) } else { @() }
            $isDhcp = if ($ipConfig) { $ipConfig.Dhcp -eq 'Enabled' } else { $true }

            # Keys MUST be strings: Windows PowerShell 5.1 ConvertTo-Json
            # refuses hashtables with integer keys ("Keys must be strings"),
            # which would abort the snapshot write in the elevated child.
            $snapshotData[[string]$idx] = @{
                InterfaceAlias = $adapter.InterfaceAlias
                InterfaceIndex = $idx
                OriginalIPv4Servers = $origV4
                OriginalIPv6Servers = $origV6
                DhcpEnabled = $isDhcp
            }
        }

        # Write snapshot atomically
        $json = $snapshotData | ConvertTo-Json -Depth 5
        [System.IO.File]::WriteAllText($SnapshotPath, $json)

        # Apply 127.0.0.1 IPv4 DNS to active adapters
        foreach ($adapter in $activeAdapters) {
            $idx = $adapter.InterfaceIndex
            Set-DnsClientServerAddress -InterfaceIndex $idx -ServerAddresses ("127.0.0.1") -ErrorAction Stop
        }

        # Flush DNS cache
        Clear-DnsClientCache -ErrorAction SilentlyContinue
        ipconfig /flushdns | Out-Null
        Write-Status "SUCCESS"
        Write-Output "SUCCESS: DNS applied and snapshot created at $SnapshotPath"
        exit 0

    } elseif ($Action -eq '--restore') {
        if (-not $SnapshotPath -or -not (Test-Path $SnapshotPath)) {
            $activeAdapters = Get-ActiveAdapters
            foreach ($adapter in $activeAdapters) {
                Set-DnsClientServerAddress -InterfaceIndex $adapter.InterfaceIndex -ResetServerAddresses -ErrorAction SilentlyContinue
            }
            Clear-DnsClientCache -ErrorAction SilentlyContinue
            ipconfig /flushdns | Out-Null
            Write-Status "RESTORED"
            exit 0
        }

        $rawJson = [System.IO.File]::ReadAllText($SnapshotPath)
        $snapshotData = ConvertFrom-Json $rawJson

        foreach ($key in $snapshotData.PSObject.Properties.Name) {
            $entry = $snapshotData.$key
            $idx = $entry.InterfaceIndex
            
            try {
                if ($entry.DhcpEnabled -and (-not $entry.OriginalIPv4Servers -or $entry.OriginalIPv4Servers.Count -eq 0)) {
                    Set-DnsClientServerAddress -InterfaceIndex $idx -ResetServerAddresses -ErrorAction Stop
                } elseif ($entry.OriginalIPv4Servers -and $entry.OriginalIPv4Servers.Count -gt 0) {
                    Set-DnsClientServerAddress -InterfaceIndex $idx -ServerAddresses $entry.OriginalIPv4Servers -ErrorAction Stop
                } else {
                    Set-DnsClientServerAddress -InterfaceIndex $idx -ResetServerAddresses -ErrorAction Stop
                }
            } catch {
                Write-Warning "Failed to restore DNS on interface index $idx : $_"
            }
        }

        # Flush DNS cache and remove snapshot
        Clear-DnsClientCache -ErrorAction SilentlyContinue
        ipconfig /flushdns | Out-Null

        Remove-Item $SnapshotPath -Force -ErrorAction SilentlyContinue
        Write-Status "RESTORED"
        Write-Output "SUCCESS: DNS restored from $SnapshotPath"
        exit 0

    } else {
        Write-Status "ERROR: Invalid action $Action"
        exit 1
    }
} catch {
    Write-Status "ERROR: $_"
    exit 1
}
