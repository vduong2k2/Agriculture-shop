import React from "react";
<<<<<<< HEAD
// import { useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
// import Loader from "../components/Layout/Loader";

const EventsPage = () => {
  //   const { allEvents, isLoading } = useSelector((state) => state.events);
  return (
    <>
      {/* {isLoading ? (
=======
import { useSelector } from "react-redux";
import EventCard from "../components/Events/EventCard";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";

const EventsPage = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);
  return (
    <>
      {isLoading ? (
>>>>>>> origin/nqkha
        <Loader />
      ) : (
        <div>
          <Header activeHeading={4} />
          <EventCard active={true} data={allEvents && allEvents[0]} />
        </div>
<<<<<<< HEAD
      )} */}
      <div>
        <Header activeHeading={4} />
        <EventCard active={true} />
        <EventCard active={true} />
      </div>
=======
      )}
>>>>>>> origin/nqkha
    </>
  );
};

export default EventsPage;
