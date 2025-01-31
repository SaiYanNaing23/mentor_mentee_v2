"use client"
import { useMatchStore } from '@/store/match'
import {Button} from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import Link from 'next/link';

const page = () => {
    const { skills, updateSkills,getMentor } = useMatchStore();
    const router = useRouter();
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [ isMatching, setIsMatching ] = useState(false);

  const matchingHandler = () => {
    if (selectedSkills.length === 0) {
        return; 
    }

    setIsMatching(true);
    updateSkills({ skills: selectedSkills }).then(() => {
        getMentor();
    });
    router.push("/recommendation");
    setIsMatching(false);
};

const onChooseSkillHandler = (skill) => {
    setSelectedSkills((prevSelectedSkills) => {
        if (prevSelectedSkills.includes(skill)) {
         
            return prevSelectedSkills.filter((selectedSkill) => selectedSkill !== skill);
        } else if (prevSelectedSkills.length < 4) {
            return [...prevSelectedSkills, skill];
        }
        return prevSelectedSkills;
    });
};

return (
    <div className="h-screen flex w-screen relative">
        <div className="absolute top-5 left-5 flex items-center group">
        <Link href="/initial">
        <img src="../../assets/icons/home2.svg" alt="Home Logo" width="50px" />
        <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-black text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        Go back to Initial Page
        </span>
        </Link>
        </div>
        <div className="w-1/2 items-center justify-center h-screen md:flex hidden">
            <img
                src="../../assets/images/skills.svg"
                alt="Choose skills"
                width="550px"
                className="m-auto"
            />
        </div>
        <div className="w-4/5 md:w-1/2 flex mt-[9%] justify-center">
            <div className=' md:ml-0 ml-[20%] ' >
                <p className="text-[16px] md:text-[22px] mb-12 font-bold tracking-wide leading-relaxed">
                    <span className="text-[24px] font-extrabold">
                        Pick at least ONE skill, up to FOUR skills
                    </span>
                    <br />
                    that best match your expertise and interests
                    <br />
                    from the given options!
                </p>
                {skills.length &&
                    skills.map((skill, index) => (
                        <Button
                            color={selectedSkills.includes(skill) ? "success" : "primary"}
                            size="lg"
                            key={index}
                            className="text-[18px] !py-[20px] !px-[25px] mr-5 mb-8"
                            onClick={() => onChooseSkillHandler(skill)}
                        >
                            {skill}
                        </Button>
                    ))}
            </div>
            <div className="absolute bottom-12 right-20">
                <Button
                    color="primary"
                    className="!text-[18px] !py-[20px] !px-[25px] mr-5 mb-8"
                    onClick={matchingHandler}
                    disabled={selectedSkills.length === 0 || selectedSkills.length > 4}
                >
                    Next
                </Button>
            </div>
        </div>
    </div>
);

}

export default page
