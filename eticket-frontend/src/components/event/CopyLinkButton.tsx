"use client";
import { Button } from "antd";
import { IoShareSocialOutline } from "react-icons/io5";

const CopyLinkButton = ({ link }: { link: string }) => {
  return <Button
        type="link"
        icon={<IoShareSocialOutline size={24}/>}
        className="bg-blue-500 hover:bg-blue-600 text-white"
        onClick={() => navigator.clipboard.writeText(window.location.href)}
      />
}
export default CopyLinkButton;