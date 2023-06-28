import { DateTime } from "luxon";

const getDate = () => {
  return DateTime.now().toLocal({ zone: "Asia/Dhaka" }).toISODate();
};
export default getDate;
