import React, { useState } from "react";
import CourseCard from "./CourseCard";

const CourseList = ({ courses, onSelectCourse }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  // Statistik course
  const completedCourses = courses.filter(course => course.progress === 100).length;
  const inProgressCourses = courses.filter(course => course.progress > 0 && course.progress < 100).length;
  const notStartedCourses = courses.filter(course => course.progress === 0).length;

  return (
    <div className="bg-white shadow-md rounded-lg w-full max-w-4xl p-6">
      {/* Header dengan Toggle */}
      <div 
        className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
        onClick={toggleExpanded}
      >
        <div>
          <h3 className="text-xl font-semibold text-gray-800">Pelatihan</h3>
          <div className="flex items-center space-x-4 mt-1">
            <p className="text-sm text-gray-600">{courses.length} total pelatihan</p>
            {completedCourses > 0 && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                {completedCourses} selesai
              </span>
            )}
            {inProgressCourses > 0 && (
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                {inProgressCourses} berjalan
              </span>
            )}
            {notStartedCourses > 0 && (
              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                {notStartedCourses} belum mulai
              </span>
            )}
          </div>
        </div>
        
        {/* Toggle Icon */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 font-medium">
            {isExpanded ? "Tutup" : "Lihat Semua"}
          </span>
          <div className="p-1">
            <svg 
              className={`w-5 h-5 text-gray-500 transform transition-transform duration-300 ${
                isExpanded ? "rotate-180" : ""
              }`}
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M19 9l-7 7-7-7" 
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Course List (Collapsible) */}
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${
        isExpanded ? "max-h-[800px] opacity-100 mt-6" : "max-h-0 opacity-0"
      }`}>
        {courses.length > 0 ? (
          <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
            {courses.map((course, index) => (
              <CourseCard 
                key={course.kode || index} 
                course={course} 
                onViewCourse={onSelectCourse}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <p className="text-gray-500">Belum ada pelatihan terdaftar</p>
          </div>
        )}
      </div>

      {/* Quick Preview (When Collapsed) */}
      {!isExpanded && courses.length > 0 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 mb-1">{courses[0].nama}</p>
              {/* <div className="flex items-center space-x-3">
                <p className="text-xs text-gray-500">Kode: {courses[0].kode}</p>
                <span className="text-xs text-gray-400">•</span>
                <p className="text-xs text-gray-600">{courses[0].progress}% selesai</p>
              </div> */}
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-teal-400 to-teal-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${courses[0].progress}%` }}
                ></div>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseList;