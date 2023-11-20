param(
    [string]$firstFilePath,
    [string]$secondFilePath
)

Add-Type -AssemblyName System.Windows.Forms

function Merge-Json($dest, $src) {
    foreach ($prop in $src.PSObject.Properties) {
        if ($null -eq $dest.$($prop.Name) ) {
            $dest | Add-Member -MemberType NoteProperty -Name $($prop.Name) -Value $prop.Value
        }
        elseif ($dest.$($prop.Name) -is [System.Management.Automation.PSCustomObject] -and $prop.Value -is [System.Management.Automation.PSCustomObject]) {
            Merge-Json -dest $dest.$($prop.Name) -src $prop.Value
        }
        else {
            $dest.$($prop.Name) = $prop.Value
        }
    }
}

function Format-Json([Parameter(Mandatory, ValueFromPipeline)][String] $json) {
    $indent = 0;
  ($json -Split '\n' |
    ForEach-Object {
        if ($_ -match '[\}\]]') {
            # This line contains  ] or }, decrement the indentation level
            $indent--
        }
        $line = (' ' * $indent * 2) + $_.TrimStart().Replace(':  ', ': ')
        if ($_ -match '[\{\[]') {
            # This line contains [ or {, increment the indentation level
            $indent++
        }
        $line
    }) -Join "`n"
}


$OpenSourceFileDialog = New-Object System.Windows.Forms.OpenFileDialog
$OpenSourceFileDialog.InitialDirectory = [Environment]::GetFolderPath('MyDocuments') + "\My Games\Skyrim Special Edition\OStim"
$OpenSourceFileDialog.filter = "json files|*.json"
$OpenSourceFileDialog.Title = "Select: merge into file"

$OpenTargetFileDialog = New-Object System.Windows.Forms.OpenFileDialog
$OpenTargetFileDialog.filter = "json files|*.json"
$OpenTargetFileDialog.Title = "Select: merge from file"

function Get-IsInvalidPath($path) {
    [string]::IsNullOrWhiteSpace($path) -or -not (Test-Path $path)
}

if (Get-IsInvalidPath -path $firstFilePath) {
    Write-Host "FFF1 true"
} else {
    Write-Host "FFF1 false"
}

if (Get-IsInvalidPath -path $firstFilePath) {
    
    if($OpenSourceFileDialog.ShowDialog() -eq "OK") {
        $firstFilePath = $OpenSourceFileDialog.FileName
        Write-Host "SSS"
        Write-Host $firstFilePath
    } else {
        exit
    }
}

if (Get-IsInvalidPath -path $secondFilePath) {
    if($OpenTargetFileDialog.ShowDialog() -eq "OK") {
        $secondFilePath = $OpenTargetFileDialog.FileName
    } else {
        exit
    }
}

Write-Host $secondFilePath
Write-Host $firstFilePath

# Load JSON content from files
$firstJson = Get-Content -Raw -Path $firstFilePath | ConvertFrom-Json
$secondJson = Get-Content -Raw -Path $secondFilePath | ConvertFrom-Json

# Function to merge properties recursively

Merge-Json -dest $firstJson -src $secondJson

$firstJson = $firstJson | ConvertTo-Json -Depth 100 | Format-Json
# Replace escaped & with unescaped &
$firstJson = $firstJson -replace '\\u0026', '&'

# Convert merged object back to JSON and overwrite the first file
$firstJson | Set-Content -Path $firstFilePath

Write-Host "Merge complete. Merged content saved to $firstFilePath"

Read-Host -Prompt "Press Enter to exit"

if ($Host.Name -eq "ConsoleHost")
{
    Write-Host "Press any key to continue..."
    $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyUp") > $null
}
