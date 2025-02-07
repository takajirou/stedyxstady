"use client";
import styles from "@styles/appStyles/option/Page.module.scss";

import { supabase } from "@/lib/supabaseClient";

export default function Page() {
    const today = new Date();
    const DeleteSchedule = async () => {
        const { error } = await supabase
            .from("Schedule")
            .delete()
            .eq("date", today.toISOString().split("T")[0])
            .single();

        if (error) {
            console.error("Error fetching schedule data:", error);
        }
    };

    return (
        <div className={styles.optionWrap}>
            <h1>Option Page</h1>
            <button onClick={DeleteSchedule}>リセット</button>
        </div>
    );
}
