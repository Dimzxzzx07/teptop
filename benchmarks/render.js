export const benchmarkRender = views => views.reduce((total, view) => total + String(view).length, 0);
