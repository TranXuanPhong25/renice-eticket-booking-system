import { AppMenu } from "./AppMenu";
import { Container } from "./Container";

export const Header = () => {
  return (
    <div className="shadow-sm px-10">
      <Container>
        <div className="flex items-center justify-between">
          <div className="font-bold text-blue-600">eTicket</div>
          <AppMenu />
        </div>
      </Container>
    </div>
  );
};
