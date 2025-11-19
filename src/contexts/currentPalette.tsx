import { createContext, useContext, useState, useEffect } from "react";
import { isContinuousPalette, isMatrixPalette } from "@antv/color-schema";
import { v4 as uuidv4 } from "uuid";
import { cloneDeep, isEqual, noop } from "lodash";
import ASSETS from "@/constants/assets";
import type { Color, Palette, ColorValue } from "@antv/color-schema";

interface Snapshot {
  palette: Palette;
}

const defaultPalette = ASSETS.palettes[0];
const MAX_SNAPSHOT = 200;

const setIDs = (palette: Palette, update = false) => {
  const newPalette = update ? palette : cloneDeep(palette);
  newPalette.id = uuidv4();
  if (!isMatrixPalette(newPalette)) {
    newPalette.colors.forEach((color: Color) => {
      const copyColor = color;
      copyColor.id = uuidv4();
    });
  }
  return newPalette;
};

const newPalette = setIDs(defaultPalette);

const CurrentPaletteContext = createContext({
  currentPalette: newPalette,
  locked: new Array(newPalette.colors.length).fill(false) as boolean[],
  setCurrentPalette: noop as (
    palette: Palette,
    updateId?: boolean,
    updateLocked?: boolean
  ) => void,
  addColor: noop as (index: number, color: ColorValue) => string,
  updateColor: noop as (index: number, color: ColorValue) => void,
  removeColor: noop as (index: number) => void,
  reorderColor: noop as (source: number, destination: number) => void,
  lockColor: noop as (index: number) => void,
  canUndo: false,
  canRedo: false,
  undo: noop as () => void,
  redo: noop as () => void,
  snapshot: noop as (palette: Palette) => void,
});

const CurrentPaletteProvider: React.FC<{
  children?: React.ReactNode;
}> = ({ children }) => {
  const [currentPalette, setPalette] = useState<Palette>(newPalette);
  const [locked, setLocked] = useState<boolean[]>(
    new Array(newPalette.colors.length).fill(false)
  );
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [cursor, setCursor] = useState<number>(-1);
  const canUndo = snapshots.length > 0 && cursor > 0;
  const canRedo = snapshots.length > 0 && cursor < snapshots.length - 1;

  const undo = () => {
    if (canUndo) {
      const newCursor = cursor - 1;
      const present = snapshots[newCursor] as Snapshot;

      setCursor(newCursor);
      setPalette(present.palette);
    }
  };

  const redo = () => {
    if (canRedo) {
      const newCursor = cursor + 1;
      const present = snapshots[newCursor] as Snapshot;

      setCursor(newCursor);
      setPalette(present.palette);
    }
  };

  const snapshot = (palette: Palette) => {
    // store
    const newSnapshots = [
      ...snapshots.slice(Math.max(0, cursor - MAX_SNAPSHOT + 1), cursor + 1),
      {
        palette,
      },
    ];
    setSnapshots(newSnapshots);
    setCursor(newSnapshots.length - 1);
  };

  const setCurrentPalette = (
    palette: Palette,
    updateId: boolean = true,
    updateLocked: boolean = true
  ) => {
    if (updateId) {
      // change palette
      const paletteWithID = setIDs(palette);
      setPalette(paletteWithID);
      if (updateLocked)
        setLocked(new Array(paletteWithID.colors.length).fill(false));

      snapshot(paletteWithID);
    } else {
      // update palette
      // eslint-disable-next-line no-lonely-if
      if (!isEqual(currentPalette, palette)) {
        setPalette(palette);
        snapshot(palette);
      }
    }
  };

  const updateColor = (index: number, color: ColorValue) => {
    if (
      !isContinuousPalette(currentPalette) &&
      !isMatrixPalette(currentPalette)
    ) {
      const clonePalette = cloneDeep(currentPalette);
      const { colors } = clonePalette;
      if (!isEqual(colors[index].value, color.value)) {
        Object.assign(colors[index], color);
        setPalette(clonePalette);

        snapshot(clonePalette);
      }
    }
  };

  const removeColor = (index: number) => {
    if (
      !isContinuousPalette(currentPalette) &&
      !isMatrixPalette(currentPalette)
    ) {
      const clonePalette = cloneDeep(currentPalette);
      const { colors } = clonePalette;
      colors.splice(index, 1);
      setPalette(clonePalette);

      const newLocked = cloneDeep(locked);
      newLocked.splice(index, 1);
      setLocked(newLocked);

      snapshot(clonePalette);
    }
  };

  const addColor = (index: number, color: ColorValue) => {
    const id = uuidv4();

    if (
      !isContinuousPalette(currentPalette) &&
      !isMatrixPalette(currentPalette)
    ) {
      const clonePalette = cloneDeep(currentPalette);
      const { colors } = clonePalette;
      const newColor: Color = {
        id,
        ...color,
      };
      colors.splice(index, 0, newColor);
      setPalette(clonePalette);

      const newLocked = cloneDeep(locked);
      newLocked.splice(index, 0, false);
      setLocked(newLocked);

      snapshot(clonePalette);
    }
    return id;
  };

  const reorderColor = (source: number, destination: number) => {
    if (
      !isContinuousPalette(currentPalette) &&
      !isMatrixPalette(currentPalette)
    ) {
      const clonePalette = cloneDeep(currentPalette);
      const { colors } = clonePalette;
      const temp = colors[source];
      colors.splice(source, 1);
      colors.splice(destination, 0, temp);
      setPalette(clonePalette);

      const newLocked = cloneDeep(locked);
      const lockTemp = newLocked[source];
      newLocked.splice(source, 1);
      newLocked.splice(destination, 0, lockTemp);
      setLocked(newLocked);

      snapshot(clonePalette);
    }
  };

  const lockColor = (index: number) => {
    const newLocked = cloneDeep(locked);
    newLocked[index] = !newLocked[index];
    setLocked(newLocked);
  };

  useEffect(() => {
    snapshot(defaultPalette);
  }, []);

  return (
    <CurrentPaletteContext.Provider
      value={{
        currentPalette,
        locked,
        setCurrentPalette,
        addColor,
        updateColor,
        removeColor,
        reorderColor,
        lockColor,

        canUndo,
        canRedo,
        undo,
        redo,
        snapshot,
      }}
    >
      {children}
    </CurrentPaletteContext.Provider>
  );
};

export const withCurrentPaletteProvider =
  <T extends Record<string, any>>(Component: React.ComponentType<T>) =>
  (props: T) => {
    return (
      <CurrentPaletteProvider>
        <Component {...props} />
      </CurrentPaletteProvider>
    );
  };

export const useCurrentPaletteContext = () => {
  return useContext(CurrentPaletteContext);
};
