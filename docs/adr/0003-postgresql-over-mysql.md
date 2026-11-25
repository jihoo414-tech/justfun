# MySQL이 더 익숙하지만 PostgreSQL을 쓴다

사용자는 MySQL이 더 익숙하지만 DB로 PostgreSQL을 고른다. 승인 카드의 조건이나 행동 기록의 도구 입력값처럼 도구마다 모양이 다른 데이터를 JSONB로 저장하고 검색할 수 있다. 또 기억 메모가 많아지면 같은 DB에서 pgvector로 의미 기반 검색을 붙일 수 있다. JPA를 쓰면 MySQL과의 차이는 크지 않아서, 익숙함의 이점보다 이 두 가지를 우선했다.

## Consequences

- `user`는 PostgreSQL 예약어라서 사용자 테이블 이름은 `users`로 짓는다.
