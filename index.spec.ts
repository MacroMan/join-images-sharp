import { describe, expect, it } from "vitest";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import { mkdir, readFile } from "node:fs/promises";
import joinImages, { JoinImageDirection } from "./index";

declare module "vitest" {
  interface Assertion<T> {
    toMatchImageSnapshot: () => T;
  }
}

expect.extend({ toMatchImageSnapshot })

describe('Join images sharp', async () => {
    await mkdir('test-images-output', { recursive: true });

    it('Direction "auto" stacks vertically with landscape images', async () => {
        await joinImages([
            'test-images/landscape-1.png',
            'test-images/landscape-2.png',
        ], 'test-images-output/auto-landscape.png');

        expect(await readFile('test-images-output/auto-landscape.png')).toMatchImageSnapshot();
    });

    it('Direction "auto" stacks horizontally with portrait images', async () => {
        await joinImages([
            'test-images/portrait-1.png',
            'test-images/portrait-2.png',
        ], 'test-images-output/auto-portrait.png');

        expect(await readFile('test-images-output/auto-portrait.png')).toMatchImageSnapshot();
    });

    it('Direction "auto-reverse" stacks horizontally with landscape images', async () => {
        await joinImages([
            'test-images/landscape-1.png',
            'test-images/landscape-2.png',
        ], 'test-images-output/auto-reverse-landscape.png', { direction: JoinImageDirection.AutoReverse });

        expect(await readFile('test-images-output/auto-reverse-landscape.png')).toMatchImageSnapshot();
    });

    it('Direction "auto-reverse" stacks vertically with portrait images', async () => {
        await joinImages([
            'test-images/portrait-1.png',
            'test-images/portrait-2.png',
        ], 'test-images-output/auto-reverse-portrait.png', { direction: JoinImageDirection.AutoReverse });

        expect(await readFile('test-images-output/auto-reverse-portrait.png')).toMatchImageSnapshot();
    });

    it('Direction "horizontal" stacks horizontally with portrait images', async () => {
        await joinImages([
            'test-images/portrait-1.png',
            'test-images/portrait-2.png',
        ], 'test-images-output/horizontal-portrait.png', { direction: JoinImageDirection.Horizontal });

        expect(await readFile('test-images-output/horizontal-portrait.png')).toMatchImageSnapshot();
    });

    it('Direction "horizontal" stacks horizontally with landscape images', async () => {
        await joinImages([
            'test-images/landscape-1.png',
            'test-images/landscape-2.png',
        ], 'test-images-output/horizontal-landscape.png', { direction: JoinImageDirection.Horizontal });

        expect(await readFile('test-images-output/horizontal-landscape.png')).toMatchImageSnapshot();
    });

    it('Direction "vertical" stacks vertically with portrait images', async () => {
        await joinImages([
            'test-images/portrait-1.png',
            'test-images/portrait-2.png',
        ], 'test-images-output/vertical-portrait.png', { direction: JoinImageDirection.Vertical });

        expect(await readFile('test-images-output/vertical-portrait.png')).toMatchImageSnapshot();
    });

    it('Direction "vertical" stacks vertically with landscape images', async () => {
        await joinImages([
            'test-images/landscape-1.png',
            'test-images/landscape-2.png',
        ], 'test-images-output/vertical-landscape.png', { direction: JoinImageDirection.Vertical });

        expect(await readFile('test-images-output/vertical-landscape.png')).toMatchImageSnapshot();
    });

    it('Specified "background" colour in hex is output in image', async () => {
        await joinImages([
            'test-images/landscape-1.png',
            'test-images/landscape-2.png',
        ], 'test-images-output/auto-landscape.png', { background: '#ff00ff' });

        expect(await readFile('test-images-output/auto-landscape.png')).toMatchImageSnapshot();
    });

    it('Specified "background" colour in rgba is output in image', async () => {
        await joinImages([
            'test-images/landscape-1.png',
            'test-images/landscape-2.png',
        ], 'test-images-output/auto-landscape.png', { background: { alpha: 0.5, b: 255, g: 0, r: 0 } });

        expect(await readFile('test-images-output/auto-landscape.png')).toMatchImageSnapshot();
    });
});
