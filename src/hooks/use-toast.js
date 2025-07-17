import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000; // Long delay for demo

const toastTimeouts = new Map();

const listeners = [];

let state = {
    toasts: [],
};

const reducer = (state, action) => {
    switch (action.type) {
        case "ADD_TOAST":
            return {
                ...state,
                toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
            };

        case "UPDATE_TOAST":
            return {
                ...state,
                toasts: state.toasts.map((t) =>
                    t.id === action.toast.id ? { ...t, ...action.toast } : t
                ),
            };

        case "DISMISS_TOAST":
            if (action.toastId) {
                toastTimeouts.delete(action.toastId);
            }
            return {
                ...state,
                toasts: state.toasts.filter(
                    (toast) => toast.id !== action.toastId
                ),
            };

        case "REMOVE_TOAST":
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: [],
                };
            }
            return {
                ...state,
                toasts: state.toasts.filter(
                    (toast) => toast.id !== action.toastId
                ),
            };

        default:
            return state;
    }
};

const addToRemoveQueue = (toastId) => {
    if (toastTimeouts.has(toastId)) return;

    const timeout = setTimeout(() => {
        toastTimeouts.delete(toastId);
        dispatch({
            type: "REMOVE_TOAST",
            toastId: toastId,
        });
    }, TOAST_REMOVE_DELAY);

    toastTimeouts.set(toastId, timeout);
};

function dispatch(action) {
    state = reducer(state, action);
    listeners.forEach((listener) => listener(state));
}

function toast({ title, description, action, icon, variant }) {
    const id = uuidv4();

    const update = (props) =>
        dispatch({ type: "UPDATE_TOAST", toast: { ...props, id } });

    const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });

    dispatch({
        type: "ADD_TOAST",
        toast: {
            id,
            title,
            description,
            action,
            icon,
            variant,
        },
    });

    addToRemoveQueue(id);

    return {
        id,
        update,
        dismiss,
    };
}

function useToast() {
    const [toasts, setToasts] = useState(state.toasts);

    useEffect(() => {
        const listener = (newState) => {
            setToasts(newState.toasts);
        };

        listeners.push(listener);
        return () => {
            const index = listeners.indexOf(listener);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }, []);

    return {
        ...state,
        toast,
    };
}

export { useToast, toast };
