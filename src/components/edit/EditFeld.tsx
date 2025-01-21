"use client";

import styles from "@styles/componentStyles/edit/EditField.module.scss";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Link from "next/link";
import { supabase } from "@lib/supabaseClient";

interface Objectives {
    id: number;
    Objective: string;
    Size: string;
}
export default function EditFeld() {
    const [grandObjective, setGrandObjective] = useState<Objectives[]>([]);
    const [weekObjective, setWeekObjective] = useState<Objectives[]>([]);

    useEffect(() => {
        const fetchGrandObjectives = async () => {
            try {
                const { data, error } = await supabase
                    .from("Objectives")
                    .select("*")
                    .eq("Size", "grand");

                if (error) {
                    console.error("Error fetching grand objectives:", error.message);
                    return null;
                }
                return data;
            } catch (err) {
                console.error("Unexpected error fetching grand objectives:", err);
                return null;
            }
        };

        const fetchWeekObjectives = async () => {
            try {
                const { data, error } = await supabase
                    .from("Objectives")
                    .select("*")
                    .eq("Size", "week");

                if (error) {
                    console.error("Error fetching week objectives:", error.message);
                    return null;
                }
                return data;
            } catch (err) {
                console.error("Unexpected error fetching week objectives:", err);
                return null;
            }
        };

        const fetchObjectives = async () => {
            const [grandData, weekData] = await Promise.all([
                fetchGrandObjectives(),
                fetchWeekObjectives(),
            ]);

            if (grandData) setGrandObjective(grandData);
            if (weekData) setWeekObjective(weekData);
        };

        fetchObjectives();
    }, []);

    async function UpdateObjective() {
        const { data, error } = await supabase
            .from("Objectives")
            .update({ Objective: "新しい名前" })
            .eq("", 1);

        if (error) {
            console.error("更新中にエラーが発生しました:", error);
            return;
        }

        console.log("更新されたデータ:", data);
    }

    return (
        <>
            <div className={styles.EditFieldWrap}>
                <div className={styles.EditObjective}>
                    <TextField
                        fullWidth
                        label="大目標"
                        placeholder={grandObjective.length > 0 ? grandObjective[0].Objective : ""}
                        helperText="最大50文字"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                            maxLength: 50,
                            style: { fontSize: "1.5rem" },
                        }}
                        sx={{
                            "& label": {
                                fontSize: "1.5rem",
                            },
                            "& .MuiFormHelperText-root": {
                                fontSize: "1.2rem",
                            },
                        }}
                    />
                </div>
                <div className={styles.EditObjective}>
                    <TextField
                        fullWidth
                        label="週目標"
                        placeholder={weekObjective.length > 0 ? weekObjective[0].Objective : ""}
                        helperText="最大50文字"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{
                            maxLength: 50,
                            style: { fontSize: "1.5rem" },
                        }}
                        sx={{
                            "& label": {
                                fontSize: "1.5rem",
                            },
                            "& .MuiFormHelperText-root": {
                                fontSize: "1.2rem",
                            },
                        }}
                    />
                </div>
            </div>
            <div className={styles.EditButton}>
                <Link href="/home">
                    <Button variant="outlined">戻る</Button>
                </Link>
                <Link href="/home">
                    <Button variant="contained" onClick={UpdateObjective}>
                        編集を終わる
                    </Button>
                </Link>
            </div>
        </>
    );
}
