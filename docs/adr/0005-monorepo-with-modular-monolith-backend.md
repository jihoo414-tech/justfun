# 모노레포에 서비스별 폴더를 두고, Spring은 모듈러 모놀리스로 만든다

사용자는 MSA를 염두에 두고 시작하고 싶어 한다. 그래서 `backend/`(Spring), `ai/`(Python), `frontend/`(React)를 한 레포에 두되, 각 폴더가 자기 빌드와 Dockerfile을 가져 따로 실행·배포할 수 있게 한다. 서비스끼리는 코드를 공유하지 않고 API로만 통신하며, DB는 Spring만 접근한다. Spring 자체는 v1에서 더 쪼개지 않고, 내부를 `auth`, `connection`, `approval`, `briefing` 같은 모듈(패키지)로 경계를 나눈 모듈러 모놀리스로 만든다. 사용자가 한 명뿐이라 서비스를 쪼개서 얻는 이점(독립 확장, 팀별 배포)은 없고, 서비스 간 트랜잭션, 장애 전파, 배포 관리 같은 비용만 바로 생기기 때문이다. 모듈 경계를 지켜 두면 나중에 필요한 모듈만 서비스로 떼어낼 수 있다.

## Consequences

- 모듈 경계는 Spring Modulith의 검증 테스트(`ApplicationModules.of(...).verify()`)로 지킨다. 다른 모듈의 내부 클래스를 가져다 쓰면 테스트가 실패한다.
