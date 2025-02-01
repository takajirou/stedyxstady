"use client";

import styles from "@styles/componentStyles/home/Schedule.module.scss";
import clsx from "clsx";
import { useState, useEffect } from "react";
import { Button } from "@mui/material";
import { supabase } from "@lib/supabaseClient";

interface Schedule {
    id: number;
    object: string;
    studyTime: number;
    breakTime: number;
    breakCount: number;
    studyContent: string;
    date: string;
    state: string;
}

export default function Schedule() {
    const [schedule, setSchedule] = useState<Schedule | null>(null);
    const [studyHours, setStudyHours] = useState<number>();
    const [studyMinutes, setStudyMinutes] = useState<number>();

    useEffect(() => {
        const fetchSchedules = async () => {
            const today = new Date();

            const { data } = await supabase
                .from("Schedule")
                .select("*")
                .eq("date", today.toISOString().split("T")[0])
                .eq("state", "unfinished")
                .single();

            setSchedule(data || null);
        };

        fetchSchedules();
    }, [schedule]);

    useEffect(() => {
        if (schedule) {
            setStudyMinutes(schedule.studyTime % 60);
            setStudyHours(Math.floor(schedule.studyTime / 60));
        }
    }, [schedule]);

    return (
        <div className={styles.ScheduleWrap}>
            <div className={clsx(styles.ScheduleContents, !schedule && styles.Empty)}>
                {!schedule ? (
                    <Button
                        variant="contained"
                        className={styles.EmptyButton}
                        href="/createSchedule"
                    >
                        <p>スケジュールを作成</p>
                    </Button>
                ) : (
                    ""
                )}
                <div className={styles.ScheduleTarget}>
                    <h2>目標</h2>
                    <p>{schedule ? schedule.object : ""}</p>
                </div>
                <div className={styles.StudyTime}>
                    <h2>勉強時間</h2>
                    <p>
                        {schedule
                            ? `${studyHours}時間 ${studyMinutes === 0 ? "" : ` ${studyMinutes}分`}`
                            : ""}
                    </p>
                </div>
                <div className={styles.BreakTime}>
                    <h2>休憩時間</h2>
                    <p>
                        {schedule ? ` ${schedule.breakTime}分 x ` : ""}
                        {schedule ? `${schedule.breakCount}回` : ""}
                    </p>
                </div>
                <div className={styles.StudyContent}>
                    <h2>勉強内容</h2>
                    <textarea
                        value={schedule ? schedule.studyContent : ""}
                        readOnly
                        className={styles.StudyContent}
                    ></textarea>
                </div>
            </div>
        </div>
    );
}
