# Spring이 토큰을 갖고 도구를 실행하며, Python은 판단만 한다

Spring 백엔드가 시스템의 기준이다. 사용자, DB, Google OAuth 토큰, 브리핑 스케줄러, 승인 카드, 행동 기록, 기억 메모를 모두 Spring이 맡고, Google API 호출 같은 실제 도구 실행도 Spring이 한다. Python AI 서비스는 Claude와 에이전트 루프를 돌려 "어떤 도구를 어떤 값으로 부를지"만 정하고, 실행이 필요하면 Spring의 내부 도구 API를 부른다. 이렇게 하면 Python과 LLM은 OAuth 토큰 같은 비밀값을 절대 보지 못하고, 데이터와 비밀값도 한 곳에만 있다.

## Considered Options

- **Python이 토큰을 들고 Google API를 직접 호출**: 도구를 부를 때 서비스를 한 번 덜 거쳐도 되지만, 비밀값과 데이터가 두 서비스에 흩어지고 LLM이 있는 프로세스가 토큰을 쥐게 되어 고르지 않았다.

## Consequences

- React는 Spring하고만 통신하고, Python 서비스는 외부에 공개하지 않는다. Spring과 Python은 단순 HTTP로 통신하며, v1에서는 답변 스트리밍을 하지 않는다.
- 승인이 필요한지는 Spring의 한 곳에서 판단한다. 그래야 나중에 승인 모드를 추가할 때 그곳만 고치면 된다.
