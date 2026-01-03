# Git 저장소 초기화 및 설정 스크립트

# 현재 스크립트가 있는 디렉토리로 이동
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "현재 디렉토리: $(Get-Location)" -ForegroundColor Green

# Git 저장소 초기화
if (-not (Test-Path .git)) {
    Write-Host "Git 저장소 초기화 중..." -ForegroundColor Yellow
    git init
} else {
    Write-Host "Git 저장소가 이미 존재합니다." -ForegroundColor Yellow
}

# 브랜치를 main으로 설정
Write-Host "브랜치를 main으로 설정 중..." -ForegroundColor Yellow
git branch -M main

# 모든 파일 추가
Write-Host "파일 스테이징 중..." -ForegroundColor Yellow
git add .

# 상태 확인
Write-Host "`n현재 Git 상태:" -ForegroundColor Cyan
git status

Write-Host "`n다음 단계:" -ForegroundColor Green
Write-Host "1. GitHub에서 새 저장소를 생성하세요"
Write-Host "2. 다음 명령어를 실행하세요:"
Write-Host "   git commit -m 'Initial commit: Suelo Data Analysis Platform'"
Write-Host "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
Write-Host "   git push -u origin main"

