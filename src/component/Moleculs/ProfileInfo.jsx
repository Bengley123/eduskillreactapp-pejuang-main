// src/components/molecules/ProfileInfo.jsx
const ProfileInfo = ({ label, value }) => {
    return (
      <div className="border-t border-gray-200 py-2 text-center">
        <p>
          {label} : <strong>{value}</strong>
        </p>
      </div>
    );
  };
  
  export default ProfileInfo;
  