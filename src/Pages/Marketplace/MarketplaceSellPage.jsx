import React, { useEffect, useState } from "react";
import axios from "axios";
import { useStoreState } from "pullstate";
import box from "../../Images/Boxes/luckyBox.png";
import { UIStorage } from "../../Storages/UIStorage";
import { marketplace_Load, safeAuthorize_header } from "../../Utils/EndpointsUtil";
import { getUserDataFromStorage } from "../../Utils/LocalStorageManager/LocalStorageManager";
import { getDataFromResponse } from "../../Utils/NetworkUtil";
import { getRandomString } from "../../Utils/RandomUtil";
import { isStringEmptyOrSpaces } from "../../Utils/StringUtil";

export default function MarketplaceSellPage() {
    const ui = useStoreState(UIStorage);

    useEffect(() => {
        ui.showContentLoading();
        setTimeout(() => {
            ui.hideContentLoading();
        }, 500);
    }, []);

    return (
        <div>MarketplaceSellPage</div>
    );
}
