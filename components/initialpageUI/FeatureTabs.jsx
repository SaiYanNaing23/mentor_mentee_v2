"use client";

import Image from "next/image";
import { Tabs } from "@/components/ui/Tabs";
import style from '@/components/initialpageUI/featuretabs.module.css'

export default function TabsDemo() {
  const tabs = [
    {
      title: "Dashboard",
      value: "Dashboard",
      content: (
        <TabContent
          page="Dashboard"
          text={`Welcome to your Dashboard ! Enjoy a special experience all in one place !\n Stay informed with knowledgeable blogs, explore announcements about upcoming events\n and webinars`}
          imageSrc="../../assets/images/dashboard.svg"
        />
      ),
    },
    {
      title: "Explore",
      value: "Explore",
      content: (
        <TabContent
          page="Explore"
          text={`Discover skilled mentors across various fields on the "Explore" page !\n You can browse detailed profiles and select a mentor who aligns with your goals\n Once you've found, book an appointment by choosing convenient time and start your journey !`}
          imageSrc="../../assets/images/explore.svg"
        />
      ),
    },
    {
      title: "Matches",
      value: "My Matches",
      content: (
        <TabContent
          page="My Matches"
          text={`Review matched mentors and meeting time here !\n "My Matches" section displays chosen mentors but haven't scheduled a meeting yet\n View your confirmed meeting details, chosen time, and the meeting link in "My Schedules"`}
          imageSrc="../../assets/images/match.svg"
        />
      ),
    },
    {
      title: "Messages",
      value: "Messages",
      content: (
        <TabContent
          page="Messages"
          text={`You can easily communicate with the admin on "Messages" page\n Send messages to ask questions, share feedback, or seek any information you need !\n We are always ready to help you and support you !`}
          imageSrc="../../assets/images/messages.svg"
        />
      ),
    },
    {
      title: "Profile",
      value: "Profile",
      content: (
        <TabContent
          page="Profile"
          text={`Personalize your user profile !\n You can view and edit your profile along with your profile logo\n Easily update your details and make changes to keep your profile up to date and personalized !`}
          imageSrc="../../assets/images/userprofile.svg"
        />
      ),
    },
  ];

  return (
    <div className={style.tabcontainer}>
      <Tabs tabs={tabs} />
    </div>
  );
}

const TabContent = ({ page, text, imageSrc }) => {
  return (
    <div className={style.tabcontent}>
      <p className={style.page}>{page}</p>
      <p className={style.text}>{text}</p>
      <Image
        src={imageSrc}
        alt={`${page} image`}
        width="1000"
        height="1000"
        className={style.image}
      />
    </div>
  );
};