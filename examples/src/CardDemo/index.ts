import { DemoActor } from "@anderjason/example-tools";
import { Observable } from "@anderjason/observable";
import { Duration } from "@anderjason/time";
import { Timer } from "skytree";
import { AlignBottom } from "../../../src";
import { Card } from "../../../src/Card";
import { CardLayout } from "../../../src/Card/_internal/CardLayout";

export class CardDemo extends DemoActor<void> {
  onActivate() {
    const alignBottom = this.addActor(
      new AlignBottom({
        target: {
          type: "parentElement",
          parentElement: this.parentElement,
        },
        isRemixing: false,
      })
    );

    const card = this.addActor(
      new Card({
        target: {
          type: "parentElement",
          parentElement: alignBottom.element,
        },
        maxHeight: Observable.givenValue(300),
      })
    );
    card.baseElement.innerHTML = "Empty card";

    let secondPage: CardLayout;

    this.addActor(
      new Timer({
        duration: Duration.givenSeconds(8),
        isRepeating: true,
        fn: () => {
          if (secondPage == null || !secondPage.isActive.value) {
            const secondPageTitle = Observable.givenValue("Who can see this?");

            secondPage = card.addPage({
              title: secondPageTitle,
            });

            secondPage.element.innerHTML = `
              <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit</div>
            `;

            secondPage.footerElement.innerHTML = "This is the footer";
            
            setTimeout(() => {
              secondPageTitle.setValue("Different title");
            }, 1000);
            
            setTimeout(() => {
              secondPage.element.innerHTML = `
              <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat</div>
            `;
            }, 2000);

            setTimeout(() => {
              secondPage.element.innerHTML = `
              <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
              <br />
              <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</div>
            `;
            }, 4000);
          } else {
            secondPage.deactivate();
            secondPage = undefined;
          }
        },
      })
    );
  }
}
