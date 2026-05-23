import {
  CalendarOutlined,
  DashboardOutlined,
  ShopOutlined,
  TeamOutlined,
  UnorderedListOutlined,
} from '@ant-design/icons'
import { Avatar, Flex, Layout, Menu, Space, Typography } from 'antd'
import type { MenuProps } from 'antd'
import type { ReactNode } from 'react'
import type { ViewKey } from '../types'
import { viewTitle } from '../utils/reservation'

const { Header, Sider, Content } = Layout
const { Title, Text } = Typography

const menuItems: MenuProps['items'] = [
  { key: 'dashboard', icon: <DashboardOutlined />, label: '대시보드' },
  { key: 'reservations', icon: <CalendarOutlined />, label: '예약 관리' },
  { key: 'services', icon: <UnorderedListOutlined />, label: '서비스 관리' },
  { key: 'customers', icon: <TeamOutlined />, label: '고객 관리' },
]

type AppShellProps = {
  activeView: ViewKey
  onViewChange: (view: ViewKey) => void
  children: ReactNode
}

export function AppShell({ activeView, onViewChange, children }: AppShellProps) {
  return (
    <Layout className="app-layout">
      <Sider breakpoint="lg" collapsedWidth="0" className="sidebar">
        <Flex align="center" gap={12} className="brand">
          <Avatar shape="square" size={42} className="brand-avatar">
            R
          </Avatar>
          <div>
            <Text strong className="brand-title">
              ReserveOps
            </Text>
            <Text className="brand-subtitle">점주 콘솔</Text>
          </div>
        </Flex>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[activeView]}
          items={menuItems}
          onClick={({ key }) => onViewChange(key as ViewKey)}
        />
      </Sider>

      <Layout>
        <Header className="topbar">
          <div>
            <Text type="secondary">소상공인 예약 관리</Text>
            <Title level={2}>{viewTitle(activeView)}</Title>
          </div>
          <Space>
            <ShopOutlined />
            <Text strong>홍대 뷰티 스튜디오</Text>
          </Space>
        </Header>

        <Content className="content">{children}</Content>
      </Layout>
    </Layout>
  )
}
