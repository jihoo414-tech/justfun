# agent 모듈이 루프를 지휘하고, Google 호출은 connection 모듈만 한다

Spring 모듈 사이의 호출은 한 방향으로만 흐르게 한다 (ADR 0005).

**agent가 지휘한다.** agent가 루프에 필요한 재료를 여러 모듈의 공개 API로 모으고, Python의 도구 부탁을 알맞은 모듈에 넘긴다. conversation은 메시지를 저장한 뒤 이벤트만 발행하고, agent가 그 이벤트를 듣고 루프를 시작한다. 대화 요약도 Python과 통신하는 곳을 agent 하나로 모으기 위해 agent가 Python 요약 API에 요청하고, conversation은 받은 요약을 저장만 한다.

**Google 호출은 connection만 한다.** 캘린더·Gmail 클라이언트는 토큰을 가진 connection 모듈에 둔다. 처음 스펙은 "agent/tools가 도구를 실행한다"였다. 하지만 승인 후 일정을 넣는 approval도 캘린더를 불러야 해서, 클라이언트가 agent에 있으면 agent → approval → agent 순환이 생긴다.

**행동 기록은 이벤트로 남긴다.** 각 모듈은 도메인 이벤트(예: `CardApproved`)를 발행하고, actionlog가 Spring Modulith 이벤트 리스너로 듣고 기록한다. 그래서 모든 모듈이 actionlog에 의존하지 않는다.

## Consequences

- 의존 방향은 `briefing → agent → {approval, memory, usage, auth, conversation, connection}`, `approval → {conversation, connection}`이다. conversation, connection, auth, memory, usage, actionlog는 다른 모듈을 부르지 않는다.
- 이벤트로 남기는 행동 기록은 원래 작업과 트랜잭션이 다르다. Spring Modulith의 이벤트 발행 기록(Event Publication Registry)을 켜서, 리스너가 실패해도 다시 처리할 수 있게 한다.
