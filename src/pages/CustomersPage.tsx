import { Card, Empty, Input, Space, Table, Typography } from 'antd'
import type { TableProps } from 'antd'
import { useState } from 'react'
import type { Customer } from '../types'

const { Text } = Typography

type CustomersPageProps = {
  customers: Customer[]
}

export function CustomersPage({ customers }: CustomersPageProps) {
  const [keyword, setKeyword] = useState('')
  const normalizedKeyword = keyword.trim().toLowerCase()
  const filteredCustomers = customers.filter(
    (customer) =>
      !normalizedKeyword ||
      customer.name.toLowerCase().includes(normalizedKeyword) ||
      customer.phone.includes(normalizedKeyword),
  )

  const columns: TableProps<Customer>['columns'] = [
    {
      title: '고객',
      dataIndex: 'name',
      render: (name: string, customer) => (
        <Space orientation="vertical" size={0}>
          <Text strong>{name}</Text>
          <Text type="secondary">{customer.phone}</Text>
        </Space>
      ),
    },
    {
      title: '방문 횟수',
      dataIndex: 'visits',
      render: (visits: number) => `${visits}회`,
    },
    {
      title: '최근 방문',
      dataIndex: 'lastVisit',
    },
  ]

  return (
    <Card
      title="고객 목록"
      extra={
        <Input.Search
          allowClear
          value={keyword}
          placeholder="고객명 또는 연락처"
          onChange={(event) => setKeyword(event.target.value)}
        />
      }
    >
      <Table
        rowKey="phone"
        columns={columns}
        dataSource={filteredCustomers}
        locale={{
          emptyText: <Empty description="조건에 맞는 고객이 없습니다" />,
        }}
        pagination={{ pageSize: 8 }}
      />
    </Card>
  )
}
