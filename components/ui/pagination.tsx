import RCPagination, { PaginationProps } from "@rc-component/pagination";
import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "@rc-component/pagination/assets/index.css";

const Pagination: React.FC<PaginationProps> = (props) => {
  return (
    <RCPagination
      nextIcon={<ChevronRight />}
      prevIcon={<ChevronLeft />}
      showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
      {...props}
    />
  );
};

export default Pagination;
