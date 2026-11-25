## 개발 컨벤션

코드를 수정하거나, 브랜치·PR 작업을 하거나, 작업을 위임하거나, 변경 사항을 리뷰하기 전에 [CONTRIBUTING.md](CONTRIBUTING.md)를 읽고 해당 작업 흐름, 코드 스타일, 검증 규칙을 따른다.

### 주석

주석은 꼭 필요할 때만 쓴다. 코드나 상황이 바뀌어도 변하지 않는 사실(외부 제약, 코드만 봐서는 알 수 없는 이유)만 남긴다. 코드가 하는 일을 다시 설명하거나, 작업 경위, 임시 상태, 바뀔 수 있는 값을 설명하는 주석은 쓰지 않는다.

## 에이전트 스킬

### 이슈 트래커

이슈는 `jihoo414-tech/justfun`의 GitHub Issues에서 관리한다(`gh` CLI 사용). `docs/agents/issue-tracker.md`를 참고한다.

### 분류 라벨

기본 라벨: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. `docs/agents/triage-labels.md`를 참고한다.

### 도메인 문서

단일 컨텍스트 구조로, 저장소 루트에 `GLOSSARY.md` 하나와 `docs/adr/`를 둔다. `docs/agents/domain.md`를 참고한다.
