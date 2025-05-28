import { useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useLocation } from "react-router";

export function formatedDate(date: string) {
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
}

export function getStatus(status: string) {
  switch (status) {
    case "PENDING":
      return "Pendente";
    case "REJECTED":
      return "Rejeitada";
    case "APPROVED":
      return "Aprovada";
  }
}

export function getStyle(status: string) {
  switch (status) {
    case "PENDING":
      return "bg-amber-500";
    case "REJECTED":
      return "bg-red-600";
    case "APPROVED":
      return "bg-green-500";
  }
}

export const removeAccents = (str: string) =>
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");