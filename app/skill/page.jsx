"use client"
import { useMatchStore } from '@/store/match'
import {Button} from "@nextui-org/react";
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const page = () => {
    const { skills, updateSkills,getMentor } = useMatchStore();
    const router = useRouter();
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [ isMatching, setIsMatching ] = useState(false);

    const onChooseSkillHandler = (skill) => {
      setSelectedSkills((prevSelectedSkills) => {
          if (prevSelectedSkills.includes(skill)) {
              // Remove skill if it's already selected
              return prevSelectedSkills.filter((selectedSkill) => selectedSkill !== skill);
          } else if (prevSelectedSkills.length < 4) {
              // Add skill if limit is not exceeded
              return [...prevSelectedSkills, skill];
          } else {
              // If the limit is reached, show an alert
              alert("You can select up to 4 skills only!");
              return prevSelectedSkills; // Keep the previous selection unchanged
          }
      });
  };
  

    // useEffect(()=> {
    //     if(!skills.length){
    //       return router.push("/buildingprofile")
    //     }
    //   }, [skills])

    const matchingHandler = () => {
        setIsMatching(true)
        updateSkills({ skills : selectedSkills}).then(()=> {
          getMentor()
        })
        router.push("/recommendation")
        setIsMatching(false)
    }
    
    return (
    <div className="h-screen flex w-screen">
      <div className="w-1/2 flex items-center justify-center h-screen">
      <img src="../../assets/images/skills.svg" alt="Choose skills" width="550px" className='m-auto'/>
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <div>
        <p className='text-[22px] mb-12 font-bold tracking-wide leading-relaxed'><span className='text-[24px] font-extrabold'>Pick at least ONE skill, up to FOUR skills</span><br/> that best match your expertise and interests<br/>from the given options !</p>
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
        <div className='absolute bottom-40 right-20 ' >
            <Button 
                color="secondary"
                className="!text-[18px] !py-[20px] !px-[25px] mr-5 mb-8"
                onClick={matchingHandler}
            >
                Next
            </Button>  
        </div> 
        
      </div>
    </div>

    
  );
}

export default page
