// jQuery = $ = window.jQuery;

// if (!jQuery) {
//   console.warn("jQuery required to use drag and drop");
// } else {
//   console.log("Successfully initialized drag and drop module");
// }

//TODO
/**
 * Need to make classes to detect objects on page
 * add dragstart events to objects
 * dragover events
 * and dragend events
 * Add proper error handling to typescript checks
 */

import $ from "jquery";

/**
 *
 *
 * @class DragDropAPI
 */
export class DragDropAPI {
  /**@type {(...restArgs?: string[]) => void} Function that is called when an element is dropped*/ dropFunction: (...restArgs: any[]) => void;
  /**@type {string} Class that is added to an element that is being dragged*/ draggingClass: string;
  /**@type {string} The name of the class that defines draggable elements*/ draggableClassName: string;
  /**@type {string} The name of the class that defines droppable elements*/ droppableClassName: string;
  /**@type {string} The name of the class that gets applied after an element is dropped*/ droppedClass: string;

  /**
   *
   * @param {(...restArgs: string[]) => void} dropFunction
   * @param {string} draggingClass
   * @param {string} draggableClassName
   * @param {string} droppableClassName
   */
  constructor(
    dropFunction: (...restArgs: string[]) => void = function (...restArgs: any[]) {},
    draggingClass: string = "dragging",
    droppedClass = "dropped",
    draggableClassName: string = ".draggable",
    droppableClassName: string = ".droppable"
  ) {
    this.dropFunction = dropFunction;
    this.draggingClass = draggingClass;
    this.droppedClass = droppedClass;
    this.draggableClassName =
      draggableClassName.indexOf(".") != -1
        ? draggableClassName
        : "." + draggableClassName;
    this.droppableClassName =
      droppableClassName.indexOf(".") != -1
        ? droppableClassName
        : "." + droppableClassName;
  }

  /**
   * Adds event listeners to draggable elements and a canvas to allow dragging and dropping on a specific element
   */
  canvasdrag() {
    // Find draggable elements
    let draggable = $(this.draggableClassName);
    let target: HTMLElement;

    draggable.each((index, element) => {
      // Allow dragging
      $(element).attr("draggable", 'false');

      $(element).on("mousedown", (event) => {
        let origin = event.target.getBoundingClientRect();
        event.preventDefault();

        target = <HTMLElement>element.cloneNode(true);
        target.className += (" " + this.draggingClass);

        $("body").append(target);
        target.style.position = "absolute";
        target.style.left =
          event.clientX - target.getBoundingClientRect().width / 2 + "px";
        target.style.top =
          event.clientY - target.getBoundingClientRect().height / 2 + "px";

        $("body").on("mousemove", function (event) {
          target.style.left =
            event.clientX - target.getBoundingClientRect().width / 2 + "px";
          target.style.top =
            event.clientY - target.getBoundingClientRect().height / 2 + "px";
        });

        $("body").on("mouseup", (event) => {
          $("body").off("mousemove");
          if (canDrop(target.getBoundingClientRect())) {
          } else {
            invalidDrop(origin, target).then(() => {
              $("body").off("mouseup");
            });
          }
        });
      });

      $(element).on("dragend", (event) => {
        if(!event.clientX || !event.clientY)
          return;
        let target = event.currentTarget;
        target.style.position = "absolute";
        target.style.left =
          event.clientX - target.getBoundingClientRect().width / 2 + "px";
        target.style.top =
          event.clientY - target.getBoundingClientRect().height / 2 + "px";
      });
    });

    function canDrop(clientRect: DOMRect) {
      let canvas = $(".canvas");
      if(!canvas)
        return;

      let topLeft = canvas.offset();
      let height = canvas.height();
      let width = canvas.width();

      if(!height || !topLeft || !width)
        return;

      let bottom = height + topLeft.top;
      let right = width + topLeft.left;

      if (clientRect.top > topLeft.top && clientRect.left > topLeft.left) {
        // Top left is greater than top left of canvas
        if (
          clientRect.left + clientRect.width < right &&
          clientRect.top + clientRect.height < bottom
        )
          // Less than bottom right of canvas
          return true;
      }

      return false;
    }

    async function invalidDrop(origin: DOMRect, target: HTMLElement) {
      let sleep = (ms: number) =>
        new Promise((r) => setTimeout(r, ms));

      let targetRect = target.getBoundingClientRect();
      let xOver = target.offsetLeft > origin.x;
      let yOver = target.offsetTop > origin.y;

      while (xOver || yOver) {
        xOver = target.offsetLeft > origin.x;
        yOver = target.offsetTop > origin.y;
        targetRect = target.getBoundingClientRect();

        // Assumes to the right and below
        if (yOver) target.style.top = targetRect.y - 10 + "px";
        if (xOver) target.style.left = targetRect.x - 10 + "px";
        await sleep(3);
      }

      $(target).remove();
    }
  }

  // TODO add droppable class parameter for variable droppable looks
  /**
   * Sets event listeners on droppable elements to change appearance when dragging over
   */
  setDroppableEventListeners() {
    let droppable = $(this.droppableClassName);
    let originColor = droppable.css("background-color");

    droppable.each(function (index, element) {
      element.style.backgroundColor = originColor;
      // console.log(this);

      $(this).on( "mouseover", (event) => {
        // console.log("over");
        (<HTMLElement>event.target!).style.backgroundColor = "yellow";
      });

      $(this).on("mouseleave", (event) => {
        event.target.style.backgroundColor = originColor;
      });
    });
  }

  /**
   * Sets event listeners for each draggable element on the document for mousedown, mousemove, and mouseup events
   */
  setDraggableEventListeners() {
    let draggable = $(this.draggableClassName);
    draggable.off();
    let target: HTMLElement | null;

    // Add dragging event listeners
    draggable.each((index, element) => {
      // Allow dragging
      $(element).attr("draggable", 'false');
      let prevStyle = (<HTMLElement><unknown>$(element)).style;
      $(element).off();

      // Start other event listeners when clicking on a draggable element
      $(element).on("mousedown", (event) => {
        event.preventDefault();

        target = <HTMLElement>element.cloneNode(true);

        // TODO change to be using the draggingClassName parameter instead
        // target.style.opacity = "0.6";
        // //   target.style.zIndex = -1;
        // target.style.width = "50px";
        // target.style.height = "50px";

        target.className += (" " + this.draggingClass);

        // Initially move to the mouse
        $("body").append(target);
        target.style.position = "absolute";
        //   target.style.zIndex = 5;
        target.style.left =
          event.clientX - target.getBoundingClientRect().width / 2 + "px";
        target.style.top =
          event.clientY - target.getBoundingClientRect().height / 2 + "px";

        // Move the element when the mouse moves
        let prevClosest: HTMLElement;

        $("body").on("mousemove", function (event) {
          if(!target)
            return;
          target.style.left =
            event.clientX - target.getBoundingClientRect().width / 2 + "px";
          target.style.top =
            event.clientY - target.getBoundingClientRect().height / 2 + "px";

          // Check if something droppable is beneath the dragged element
          target.hidden = true;
          let closest = <HTMLElement>document.elementFromPoint(event.clientX, event.clientY);
          target.hidden = false;

          if(!closest)
            return;

          if (closest.classList.contains("droppable")) {
            $(closest).trigger("mouseover");

            if (prevClosest != closest) $(prevClosest).trigger("mouseleave");
          }

          prevClosest = closest;
        });
      }); // End of mousedown

      // Attempt to drop
      $("body").on("mouseup", (event) => {
        $("body").off("mousemove");
        if (!target) return;

        target.hidden = true;
        let closest = document.elementFromPoint(event.clientX, event.clientY);
        target.hidden = false;

        // Insert the dragged element into the droppable container
        if (closest!.classList.contains("droppable")) {
          let newNode = <HTMLElement>target.cloneNode(true);
          if(!newNode || !closest)
            return;

          // newNode.style = <string><unknown>prevStyle;
          //TODO change this
          newNode.classList.remove("draggable");
          newNode.style.position = "relative";
          newNode.style.left = '0px';
          newNode.style.top = "0px";
          newNode.classList.remove(this.draggingClass);
          newNode.classList.add(this.droppedClass);
          closest.className = "";
          closest.appendChild(newNode);
          $(closest).off("mouseover");
          $(closest).trigger("mouseleave");
          $(closest).off("mouseleave");
          // Call passed drop function
          this.dropFunction(closest);
        }
        $(event.target).off();
        $(target).remove();
        target = null;
      });
    });
  }

  // Different section for drag and drop with appending
  appendDrag() {
    this.setDraggableEventListeners();
    this.setDroppableEventListeners();
  }
}
