import {ButtonDesktop} from "@tui-react/button";
import type {JSX} from "react/jsx-runtime";
import {Link} from "wouter";

export function NotFoundPage(): JSX.Element {
  return (
    <>
      <header className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 backdrop-blur">
        <Link href="/">
          <ButtonDesktop size="s" appearance="flat">
            ← Back to Home
          </ButtonDesktop>
        </Link>
      </header>
      <div className="center">
        <div className="p-20">
          <h1 className="font-semibold">Not Found</h1>
        </div>
      </div>
    </>
  );
}
