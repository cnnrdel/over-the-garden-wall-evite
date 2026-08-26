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
        {/* <div className={styles.titleContainer}>
          Over the Anas Wall
          <br />
          Anas Party
        </div> */}
        <Image
          src="/anas.png"
          width="500"
          height="500"
          alt="PUMPKIN KING"
          className={styles.headerGif}
        />
        <div className={styles.description}>
          <h3>WHAT IS THIS?</h3>
          This is a birthday website for my birthday. It was inspired by Marcos(and used his GitHub?), birthed by Connor, and Qashka has done stuff that I do not know because it is a surprise. I don’t like partiful so I’m using this and might use it for future events! 
          <br/><br/>Please type in ur name if you wanna come to my BIRTHDAY!
        </div>
        <br/>
        <div className={styles.details}>
          <h3>WHEN?</h3>
          On <b><u>September 26th 6:00 PM EST,</u></b> I’m having my birthday party and I’m gonna go crazy!!!!! My birthday is on the 24th though so wish me on time. Plans are a bit unsure at the moment because I need to figure out how many people are coming.
        </div>
        <br/>
        <div className={styles.bring}>
          <h3>CURRENT PLAN:</h3>
          We meet at <b><u>Tompkins square park</u></b> at 6 pm – where we will have a picnic. Whoever wants to hang out at night can come over to my place for the PARTY!! It will be fun for me!!!!
        </div>
        <br/>
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
        <br/>
        <br/>
        <div className={styles.attend}>
          <h3>Can I come?</h3>
          Yes!
          <br/>
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
        <br/>
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
                      {name} ({doots} {doots === 1 ? "nudge" : "nudges"})
                    </li>
                  ))}
                </ol>
              </ShowWhenReady>
            </div>
          </div>
          <br/>
        </div>
      </div>
    </div>
  );
}
