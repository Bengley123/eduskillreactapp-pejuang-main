import React from "react";
import Button from "../Elements/Button/index";

const CourseCard = ({ course, onViewCourse }) => {
  // Fungsi untuk menentukan warna berdasarkan progress
//   const getProgressColor = (progress) => {
//     if (progress === 0) return "bg-gray-300";
//     if (progress < 50) return "bg-yellow-500";
//     if (progress < 100) return "bg-blue-500";
//     return "bg-green-500";
//   };

  // Fungsi untuk menentukan status text
  const getStatusText = (progress, hasActivity) => {
    if (progress === 100) return "Selesai";
    if (progress > 0) return "Sedang Berjalan";
    if (!hasActivity) return "Belum Dimulai";
    return "Tersedia";
  };

  const getStatusColor = (progress, hasActivity) => {
    if (progress === 100) return "text-green-600 bg-green-100";
    if (progress > 0) return "text-blue-600 bg-blue-100";
    if (!hasActivity) return "text-gray-600 bg-gray-100";
    return "text-yellow-600 bg-yellow-100";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:border-gray-300">
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-4 flex-1">
          {/* Course Icon */}
          <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg 
              className="w-8 h-8 text-white" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" 
              />
            </svg>
          </div>
          
          {/* Course Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <p className="text-sm text-gray-500 font-medium">{course.kode}</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(course.progress, course.hasActivity)}`}>
                {getStatusText(course.progress, course.hasActivity)}
              </span>
            </div>
            
            <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2">{course.nama}</h3>
            
            {/* Activity Status */}
            <div className="mb-3">
              <p className="text-sm text-gray-600">
                {course.hasActivity ? (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Aktivitas tersedia
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    Belum ada aktivitas
                  </span>
                )}
              </p>
            </div>
            
            {/* Progress Bar */}
            {/* <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Progress Pelatihan</span>
                <span className="text-sm font-medium text-gray-800">{course.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className={`h-2.5 rounded-full transition-all duration-500 ${getProgressColor(course.progress)}`}
                  style={{ width: `${course.progress}%` }}
                ></div>
              </div>
            </div> */}
          </div>
        </div>
        
        {/* Action Button */}
        <div className="ml-6 flex-shrink-0">
          <Button 
            variant="primary" 
            size="md" 
            onClick={() => onViewCourse(course)}
            className="whitespace-nowrap"
          >
            Lihat Detail
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;