"use client";

import { EventList } from "@/module/home/EventList";
import { EventSlider } from "@/module/home/EventSlider";
import { useState } from "react";
import { Tabs, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import { useGetAllEvents } from "@/hooks/useGetAllEvents";

type TabPosition = "all" | "music" | "sport" | "fan_meeting" | "live";

export default function EventsSection() {
  const [activeTab, setActiveTab] = useState<TabPosition>("all");
  const { refetch } = useGetAllEvents();

  const handleRefresh = () => {
    refetch();
  };

  const items = [
    {
      key: "all",
      label: "Tất cả",
    },
    {
      key: "music",
      label: "Âm nhạc",
    },
    {
      key: "sport",
      label: "Thể thao",
    },
    {
      key: "fan_meeting",
      label: "Fan Meeting",
    },
    {
      key: "live",
      label: "Nhạc Sống",
    },
  ];

  return (
    <div className="events-section">
      <EventSlider />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Sự kiện</h2>
        <Button 
          icon={<ReloadOutlined />} 
          onClick={handleRefresh}
          size="small"
        >
          Làm mới
        </Button>
      </div>

      <Tabs
        activeKey={activeTab}
        items={items}
        onChange={(key) => setActiveTab(key as TabPosition)}
        className="mb-4"
      />
      
      <EventList category={activeTab === "all" ? undefined : activeTab} />
    </div>
  );
}
