import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import BookingsTable from "./BookingsTable";



const StyledLoading = styled.p`
  color: #954608;
  font-weight: bold;
`;
async function fetchData() {
  const rawData = await fetch("http://localhost:3000/bookings", {
    method: "GET",
  });
  const {
    data: { bookings },
  } = await rawData.json();

  return bookings;
}

export default function Bookings() {
  const {
    data: bookings,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchData,
  });

  if (isLoading) return <StyledLoading>Loading...</StyledLoading>;
  //TODO add a loading spinner instead of "Loading..."
  if (error) return <div>{error.message}</div>;

  return (

      <BookingsTable bookings={bookings} />

  );
}

