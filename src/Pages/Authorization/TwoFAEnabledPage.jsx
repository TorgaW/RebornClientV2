import { useStoreState } from "pullstate";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { TempLinkStorage } from "../../Storages/Stuff/TempLinkStorage";
import { baseToStr } from "../../Utils/StringUtil";

export default function TwoFAEnabledPage() {
    const params = useParams();
    const navigate = useNavigate();

    const tempLink = useStoreState(TempLinkStorage);

    const [QRLink, setQRLink] = useState(undefined);
    const [privateKey, setPrivateKey] = useState("");

    useEffect(() => {
        if (params && params.qr && params.private && params.hash) {
            if (params.hash === tempLink.link && tempLink.eAt >= new Date()) {
                tempLink.removeLink();
                setQRLink(baseToStr(params.qr));
                setPrivateKey(baseToStr(params.private));
            } else {
                tempLink.removeLink();
                navigate("/notfound");
            }
        } else {
            tempLink.removeLink();
            navigate("/notfound");
        }
    }, []);

    return (
        <div className="w-full flex flex-col gap-4 items-center p-4 text-center text-white">
            <span className="text-2xl">Please, scan this QR Code in your Google Authenticator</span>
            <div className="w-[200px] h-[200px] flex">
                <img src={QRLink} alt="qr" className="w-full h-full object-contain" />
            </div>
            <div className="w-full flex flex-col gap-2">
                <span className="text-xl">Your private key:</span>
                <span className="text-xl">{privateKey}</span>
            </div>
        </div>
    );
}
