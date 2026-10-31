"use client";

import { useActionState } from "react";
import { formatMoney, marketing, type CartLine } from "@truepointers/commerce";
import { idleActionState, type ActionState } from "@/lib/action-state";
import { removeLine, updateLine } from "@/app/cart/actions";

export function CartLineControls({ line }: { line: CartLine }) {
  const [updateState, updateAction, updatePending] = useActionState(updateLine, idleActionState);
  const [removeState, removeAction, removePending] = useActionState(removeLine, idleActionState);
  return (
    <div className="quantity">
      <form action={updateAction}>
        <input type="hidden" name="lineId" value={line.id} />
        <label className="stack">
          Quantity
          <input
            name="quantity"
            type="number"
            min={1}
            max={20}
            defaultValue={line.quantity}
            key={line.quantity}
          />
        </label>
        <button type="submit" disabled={updatePending}>
          Update
        </button>
        {updateState.error ? <p role="alert">{updateState.error}</p> : null}
      </form>
      <form action={removeAction}>
        <input type="hidden" name="lineId" value={line.id} />
        <button type="submit" disabled={removePending}>
          Remove
        </button>
        {removeState.error ? <p role="alert">{removeState.error}</p> : null}
      </form>
      <p>{formatMoney(line.total)}</p>
    </div>
  );
}

export function CheckoutForm({
  action,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
}) {
  const [state, formAction, pending] = useActionState(action, idleActionState);
  return (
    <form action={formAction}>
      {state.error ? <p role="alert">{state.error}</p> : null}
      <button className="primary" type="submit" disabled={pending}>
        {pending ? "Opening checkout" : marketing.checkoutPayLater}
      </button>
    </form>
  );
}
