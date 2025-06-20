import { Button } from "antd";
import { AppMenu } from "./AppMenu";
import { Container } from "./Container";

export const Header = () => {
  return (
    <div className="shadow-sm px-10">
      <Container>
        <div className="flex items-center justify-between">
          <div className="font-bold text-blue-600">eTicket</div>
          <AppMenu />
          <Button type="primary" className="bg-blue-500 hover:bg-blue-600">
            Đăng nhập
          </Button>
        </div>
      </Container>
    </div>
  );
};
