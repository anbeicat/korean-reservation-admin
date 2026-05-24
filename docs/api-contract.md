# API Contract Draft

当前前端仍使用 mock API adapter，但调用结构已经按真实 REST API 设计。后端接入时优先替换 `src/api/reservationApi.ts`。

## Common Response

```json
{
  "data": {}
}
```

列表接口：

```json
{
  "data": []
}
```

错误接口建议：

```json
{
  "message": "예약 정보를 찾을 수 없습니다",
  "code": "RESERVATION_NOT_FOUND"
}
```

## Workspace

```text
GET /api/workspace
```

返回首页初始化需要的数据：

```json
{
  "data": {
    "reservations": [],
    "services": [],
    "customers": []
  }
}
```

## Reservations

```text
POST /api/reservations
PATCH /api/reservations/{id}
PATCH /api/reservations/{id}/status
```

新增/编辑预约请求：

```json
{
  "customer": "김민지",
  "phone": "010-1122-3344",
  "serviceId": "hair-cut",
  "reservationDate": "2026-05-24",
  "time": "10:00",
  "memo": "첫 방문"
}
```

状态更新请求：

```json
{
  "status": "CONFIRMED"
}
```

后端需要校验：

- 영업시간: 10:00-19:00
- 예약 시간 단위: 5분
- 같은 날짜와 시간에 미취소 예약 중복 불가
- 존재하지 않는 서비스로 예약 불가

## Services

```text
POST /api/services
PATCH /api/services/{id}
PATCH /api/services/{id}/status
```

新增/编辑服务请求：

```json
{
  "name": "헤어컷",
  "duration": 45,
  "price": 35000
}
```

服务状态更新请求：

```json
{
  "status": "ACTIVE"
}
```

## Customers

```text
GET /api/customers
```

第一阶段可以只做查询。顾客数据可由预约创建时自动生成或更新。
