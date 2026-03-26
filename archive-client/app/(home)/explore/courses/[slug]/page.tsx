import CertificateCard from "@/components/courses/CertificateCard";
import CompanyStrip from "@/components/courses/CompanyStrip";
import CourseFAQs from "@/components/courses/CourseFAQs";
import CourseHero from "@/components/courses/CourseHero";
import FutureProof from "@/components/courses/FutureProof";
import LearningObjectives from "@/components/courses/LearningObjectives";
import LearningRoadmap from "@/components/courses/LearningRoadmap";
import ScrollTimeline from "@/components/courses/ScrollTimeline";
import React from "react";

const Courses = () => {
  return (
    <div>
      <CourseHero />
      <CompanyStrip />
      <LearningObjectives />
      <ScrollTimeline />
      <LearningRoadmap />
      <CertificateCard />
      <FutureProof />
      <CourseFAQs />
    </div>
  );
};

export default Courses;
