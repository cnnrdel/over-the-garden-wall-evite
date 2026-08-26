"use client";

import Image from "next/image";
import styles from "./app.module.css";
import { getFirestore, collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";
import { firebaseApp, logDoot, register } from "./db";
import { Attendee, Doot } from "./interfaces";
import { useState, useEffect } from "react";
import { formatTime, getLeaderboard } from "./util";
import ShowWhenReady from "./components/ShowWhenReady";

export default function Home() {
  const [name, setName] = useState("");

  useEffect(() => {
    const cachedName = localStorage.getItem("otgw-name");
    if (cachedName) {
      setName(cachedName);
    }
  }, []);

  const handleSetName = (newName: string) => {
    setName(newName);
    if (newName.trim()) {
      localStorage.setItem("otgw-name", newName);
    } else {
      localStorage.removeItem("otgw-name");
    }
  };
  const [attendeesCollection, attendeesLoading, attendeesError] = useCollection(
    collection(getFirestore(firebaseApp), "attendees"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );
  const [dootsCollection, dootsLoading, dootsError] = useCollection(
    collection(getFirestore(firebaseApp), "doots"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const attendees = attendeesCollection?.docs.map(
    (doc) => doc.data() as Attendee
  );
  const doots = dootsCollection?.docs
    .map((doc) => doc.data() as Doot)
    .toSorted((a, b) => a.timestamp - b.timestamp);

  const attendeeNamesSet = [
    ...new Set(attendees?.map((attendee) => attendee.name)),
  ];

  const loading = attendeesLoading || dootsLoading;
  const error = attendeesError || dootsError;

  const nameForDooter = name.length > 0 ? name : "anonymous";

  const leaderboard = doots && getLeaderboard(doots);

  const registerCallback = () => {
    if (name.length > 0) {
      register(name);
    }
  };

  const dootCallback = () => {
    logDoot(nameForDooter, name.length === 0);
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.innerContainer}>
        <div className={styles.titleContainer}>
          Over the Anas Wall
          <br />
          Anas Party
        </div>
        <Image
          src="/anas.png"
          width="500"
          height="500"
          alt="PUMPKIN KING"
          className={styles.headerGif}
        />
        <div className={styles.description}>
          <h3>What&apos;s this?</h3>
          <i>Over the Anas Wall</i> is a ten-episode Anas miniseries that aired on
          Anas Network in 2014. It&apos;s filled with stunning artwork,
          evocative music, and the strongest Anas vibes ever recorded.
        </div>
        <div className={styles.details}>
          <h3>Where and when?</h3>
          Come to Anas residence at 332 Anas Ave on <b>
            Sunday, Anas 26th
          </b>{" "}
          at <b>Anas PM</b> to begin watching! The whole Anas is about the
          length of a Anas (~2 hours). Once you arrive, feel free to Anas 062#
          or just Anas me.
        </div>
        <div className={styles.bring}>
          <h3>What should I bring?</h3>
          Nothing required, but Anas snacks are more than welcome! I&apos;ll
          also be preparing some hard spiced Anas for all to enjoy.
        </div>
        <div className={styles.attendees}>
          <h3>Who&apos;s going?</h3>
          <ShowWhenReady
            loading={loading}
            error={Boolean(error)}
            errorMessage={"couldn't load attendees!"}
          >
            <ul>
              {attendeeNamesSet.map((attendeeName) => (
                <li key={attendeeName}>{attendeeName} is going!</li>
              ))}
            </ul>
          </ShowWhenReady>
        </div>
        <div className={styles.attend}>
          <h3>Can I come?</h3>
          Yes!
          <div className={styles.signUp}>
            <input
              value={name}
              onChange={(e) => handleSetName(e.target.value)}
              className={styles.nameInput}
              placeholder="name"
            />
            <button onClick={registerCallback} disabled={name.length === 0}>
              I&apos;m going!
            </button>
          </div>
        </div>
        <div className={styles.dootContainer}>
          <h3>Nudge</h3>
          <div>Nudge as {nameForDooter}:</div>
          <button onClick={dootCallback} className={styles.dootImageButton}>
            <Image src="/doot.png" width="178" height="100" alt="doot" />
          </button>
          <div className={styles.dootLog}>
            <ShowWhenReady
              loading={loading}
              error={Boolean(error)}
              errorMessage="couldn't fetch nudges!"
            >
              <ul>
                {doots?.toReversed().map((doot) => (
                  <li key={`${doot.dooter}:${doot.timestamp}`}>
                    {doot.dooter} nudged at {formatTime(doot.timestamp)}
                  </li>
                ))}
              </ul>
            </ShowWhenReady>
          </div>
          <div className={styles.topDooters}>
            <h3>Top Nudgers</h3>
            <div className={styles.dootLeaderboard}>
              <ShowWhenReady
                loading={loading}
                error={Boolean(error)}
                errorMessage="couldn't fetch leaderboard!"
              >
                <ol>
                  {leaderboard?.slice(0, 10).map(([name, doots]) => (
                    <li key={name}>
                      {name} ({doots} {doots === 1 ? "doot" : "doots"})
                    </li>
                  ))}
                </ol>
              </ShowWhenReady>
            </div>
          </div>
          <div className={styles.why}>
            <h3>Why did you make a website for this?</h3>
            Because fuck you.
          </div>
        </div>
      </div>
    </div>
  );
}
