import React from "react";

const IconText = ({ icon: Icon, text }) => (
  <li className="flex items-center text-sm">
    <Icon className="mr-2" />
    {text}
  </li>
);

export default IconText;
