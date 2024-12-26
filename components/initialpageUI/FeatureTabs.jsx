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
          text={`Welcome to your Dashboard ! Enjoy a special experience all in one place !\n Stay informed and explore announcements about upcoming events\n and webinars`}
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
      title: "My Matches",
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
      title: "About",
      value: "About",
      content: (
        <TabContent
          page="About"
          text={`You can see our organization's main goal and motivation status \nin the about section and  you can contact us\nthrough given social media platform accounts.`}
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
    <>
    <p className={style.containertitle}>Available Features</p>
    <div className={style.tabcontainer}>
      <Tabs tabs={tabs}/>
    </div>
    </>
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