import styled from "styled-components";
import PropTypes from "prop-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import supabase from "../supabse";
import showToast from "../toast";
import Button from "./Button";
import stylePrice from "../stylePrice";
import {
  payFunction,
  checkInFunction,
  checkOutFunction,
} from "../buttonFunctions";

const StyledRow = styled.tr`
  height: 2em;
  border: 1px solid #954608;
  text-align: center;
`;

async function deleteBooking(id) {
  const { error } = await supabase.from("bookings").delete().eq("id", id);
  if (error) throw new Error("There was an error deleting the booking");
}

export default function BookingRow({ booking, dispatch }) {
  const queryClient = useQueryClient();
  const {
    _id: id,
    firstName,
    lastName,
    checkedIn,
    paid,
    checkIn,
    checkOut,
    room,
    total,
    guests,
    checkedOut,
    passport,
    birthday,
  } = booking;
  const { isLoading: isDeleting, mutate } = useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });

      // shows a toast
      showToast("success", "Successfully deleted");
    },
    onError: (error) => {
      showToast("error", `${error.message}`);
    },
  });
  const { isLoading: isPaying, mutate: mutatePay } = useMutation({
    mutationFn: payFunction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });

      // shows a toast
      showToast("success", "Successfully paid");
    },
    onError: (error) => {
      showToast("error", `${error.message}`);
    },
  });

  const { isLoading: checkingOut, mutate: mutateCheckOut } = useMutation({
    mutationFn: checkOutFunction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });

      // shows a toast
      showToast("success", "Successfully checked-out");
    },
    onError: (error) => {
      showToast("error", `${error.message}`);
    },
  });

  const { isLoading: checkingIn, mutate: mutateCheckIn } = useMutation({
    mutationFn: checkInFunction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bookings"],
      });

      // shows a toast
      showToast("success", "Successfully checked-in");
    },
    onError: (error) => {
      showToast("error", `${error.message}`);
    },
  });

  const styledTotal = stylePrice(total);

  return (
    <StyledRow>
      <td>{lastName}</td>
      <td>{firstName}</td>
      <td>{passport}</td>
      <td>{birthday}</td>
      <td>{guests}</td>
      <td>{room}</td>
      <td>
        {checkedIn ? (
          "checked-in"
        ) : (
          <Button
            onClick={() => {
              mutateCheckIn(id);
            }}
            disabled={checkingIn || checkedIn}
          >
            Check-in
          </Button>
        )}
      </td>
      <td>{checkIn}</td>
      <td>{checkOut}</td>
      <td>
        {checkedOut ? (
          "checked-out"
        ) : (
          <Button
            onClick={() => {
              mutateCheckOut(id);
            }}
            disabled={checkingOut || checkedOut}
          >
            Check-out
          </Button>
        )}
      </td>
      <td>{styledTotal}</td>
      <td>
        {paid ? (
          "PAID"
        ) : (
          <Button
            onClick={() => {
              mutatePay(id);
            }}
            disabled={isPaying || paid}
          >
            Pay
          </Button>
        )}
      </td>

      <td>
        <Button onClick={() => dispatch({ type: "edit", payload: id })}>
          Edit
        </Button>
      </td>
    </StyledRow>
  );
}

BookingRow.propTypes = {
  booking: PropTypes.object,
  dispatch: PropTypes.func,
};
