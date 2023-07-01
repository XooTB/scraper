import { DateTime } from "luxon";

const getDateTime = () => {
  return DateTime.now().toLocal({ zone: "Asia/Dhaka" });
};
export default getDateTime;
