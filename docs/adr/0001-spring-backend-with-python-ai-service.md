# Spring 백엔드와 Python AI 서비스를 나눈다

minipickle은 Java/Spring 백엔드, Python AI 서비스, React 프론트엔드로 나눈다. 사용자는 Spring 생태계에 익숙하지만, AI 쪽은 Python 생태계(에이전트·LLM 라이브러리, 예제)가 더 넓고 나중에 확장하기 좋다고 판단했다.

## Considered Options

- **Spring 하나로 전부 만들기**: 공식 Anthropic Java SDK가 있고, 승인 카드 때문에 에이전트 루프는 어차피 직접 짜야 해서 기술적으로 가능했다. 서비스 간 통신, 배포, 장애 처리를 신경 쓰지 않아도 되는 점이 장점이었지만, AI 생태계의 폭과 확장성을 우선해 고르지 않았다.

## Consequences

- 두 서비스 사이의 통신 방식, 그리고 OAuth 토큰·DB·스케줄러를 어느 쪽이 소유할지 따로 정해야 한다.
