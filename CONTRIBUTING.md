# 개발 컨벤션

## Git과 GitHub

- 최신 `main`에서 작업 단위로 짧은 브랜치를 만든다. 이슈가 있으면 `42-approval-card`처럼 번호와 작업을 이름에 담는다. `main`에는 PR로 병합하고 작업 브랜치는 병합 후 삭제한다.
- 여러 티켓을 함께 검증해야 할 때는 임시 통합 브랜치를 사용한다. 각 티켓을 독립적으로 병합할 수 있으면 각각 `main` 대상 PR을 올린다.
- 커밋 제목은 `type: 영어 설명` 형식으로 쓴다. `feat`, `fix`, `docs`, `test`, `refactor`, `chore`를 주로 사용하고, 범위가 도움이 되면 `fix(approval): prevent duplicate calendar writes`처럼 적는다. 한 커밋에 검토하거나 되돌릴 수 있는 한 가지 변경을 담고, 이유나 제약을 기록할 때 본문을 쓴다. 초기에는 PR을 검토할 때 커밋 형식도 함께 확인한다.
- 기능·버그·위임 작업은 GitHub Issue에 문제 또는 목표와 검증 가능한 완료 조건을 적는다. 오타나 문구 수정은 PR만으로 처리할 수 있다. 하위 이슈와 의존관계는 함께 조율해야 할 작업이 있을 때 사용한다. 위임할 준비가 된 이슈에는 [분류 라벨](docs/agents/triage-labels.md)의 `ready-for-agent`를 붙인다. 이슈 조작은 [이슈 트래커 지침](docs/agents/issue-tracker.md)을 따른다.
- PR 제목은 커밋과 같은 형식으로 쓰고, 본문에는 변경 요약, 검증 결과, 관련 이슈를 적는다. 이슈를 완료하는 `main` 대상 PR에는 `Closes #42`처럼 연결한다. 임시 통합 브랜치를 쓰면 최종 PR에 적는다. `main`에는 **Squash and merge**를 기본으로 한다.

## 코드 컨벤션

| 영역 | 네이밍 | 포맷과 구조 |
| --- | --- | --- |
| Java / Spring | 클래스·레코드는 `PascalCase`, 메서드·변수는 `camelCase`, 상수는 `UPPER_SNAKE_CASE`, 패키지는 소문자 | google-java-format 기본값을 쓴다. 루트 패키지 아래 `auth`, `connection`, `approval`, `briefing` 등 기능별 모듈을 둔다. 다른 모듈에 공개할 타입은 모듈 루트에 두고 구현 세부사항은 `internal`에 둔다. |
| Python | 모듈·함수·변수는 `snake_case`, 클래스는 `PascalCase`, 상수는 `UPPER_SNAKE_CASE` | Ruff로 포맷과 린트를 실행한다. `ai/` 아래 앱 패키지와 `tests/`를 두고 에이전트 루프, Spring API 클라이언트 등 책임별로 모듈을 나눈다. |
| React | 컴포넌트와 그 파일은 `PascalCase`, 훅은 `useApproval`처럼 `use`로 시작하고, 함수·변수는 `camelCase` | Prettier로 포맷하고 ESLint로 검사한다. `frontend/src/features/approval/`처럼 기능별로 화면·훅·API 호출을 모은다. 여러 기능이 사용하는 코드는 `shared/`에 둔다. |

## 테스트와 완료 기준

- 입력 검증과 상태 전환은 단위 테스트로, Spring–Python 계약과 DB 동작은 통합 테스트로 확인한다. 브라우저 E2E 테스트는 Playwright로 쓰고, v1에서는 승인 카드 흐름(카드 표시, 승인 후 일정 추가, 거절) 하나만 대상으로 한다. 나머지 화면은 직접 써 보며 확인한다. E2E도 모의 Google·Claude 응답으로 실행한다. 초기 테스트 범위는 동작의 중요도와 실패 위험으로 결정하고, 커버리지는 참고 지표로 본다.
- CI는 GitHub Actions 워크플로 하나로 시작한다. `main` 대상 코드 PR에서 구현된 서비스의 포맷·린트, 빌드, 테스트를 실행한다. Spring Modulith의 [모듈 경계 검증](docs/adr/0005-monorepo-with-modular-monolith-backend.md)을 테스트에 포함한다. 일반 PR 검증은 모의 Google·Claude 응답으로 실행한다. GitHub 플랜에서 지원하면 CI 통과를 병합 조건으로 설정한다.

PR 병합 전에 다음을 확인한다.

- [ ] 이슈가 있다면 완료 조건을 충족했다. 버그 수정에는 재발을 검출하는 테스트를 추가했다.
- [ ] 관련 CI가 통과했고 PR에 검증 방법과 결과를 기록했다. 화면 변경은 필요한 경우 스크린샷이나 재현 절차를 첨부했다.
- [ ] API 계약이나 실행 방법이 바뀌었다면 관련 문서를 같은 PR에서 갱신했다.

## AI 협업

- Claude Code, Codex, Antigravity의 훅이 사람이 입력한 프롬프트를 `.prompt-log/<도구>/<세션 ID>.jsonl`에 저장한다. 이 디렉터리는 git에서 제외한다. 에이전트 출력은 복사하지 않고 각 줄의 `transcript_path`로 찾는다. 에이전트가 만든 커밋에는 세션을 알 수 있으면 본문 끝에 `Session: <도구>/<세션 ID>` 트레일러를 붙여 커밋에서 프롬프트 로그를 찾을 수 있게 한다.

- 작업마다 구현 담당을 하나 정한다. Claude Code를 주 구현에 쓰고, Codex에는 중요한 PR의 독립 리뷰나 범위가 분명한 별도 티켓을 맡긴다. Antigravity에는 실행 가능한 화면의 브라우저 검증을 맡긴다.
- 위임할 때는 이슈, 완료 조건, 작업 범위를 전달한다. 여러 에이전트가 동시에 코드를 수정하면 작업별로 브랜치와 Git 워크트리를 나눈다.
- 승인, OAuth, DB 변경, 서비스 간 계약은 독립 리뷰를 우선 적용한다. 리뷰어에게 이슈와 PR 또는 커밋을 주고 요구사항 충족 여부와 저장소 규칙 준수 여부를 확인하게 한다. 지적 사항에는 파일 위치와 문제가 발생하는 조건을 적는다.
- 완료 보고에는 실행한 검증과 결과, 확인하지 못한 항목을 남긴다. 프로젝트 관리자가 PR 변경 사항, CI 결과, 중요한 리뷰 지적의 처리 여부를 확인한 뒤 병합한다.

## 관련 문서

- [AGENTS.md](AGENTS.md)는 에이전트의 공통 작업 지침이다.
- [GLOSSARY.md](GLOSSARY.md)는 제품 용어의 기준이다.
- [docs/architecture.md](docs/architecture.md)는 서비스 구성, Spring 모듈과 의존 방향, 애그리거트를 정리한다. [docs/erd.md](docs/erd.md)는 테이블과 컬럼을 정리한다. 테이블이나 모듈 경계를 바꾸는 PR에서 함께 갱신한다.
- [docs/adr/](docs/adr/)에는 구현에 영향을 주는 설계 결정과 이유를 기록한다. 결정을 바꾸는 PR에서 관련 ADR을 갱신한다.
