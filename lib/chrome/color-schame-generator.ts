import chroma from "chroma-js";

function colorSchameGenerator(
  begin_color: string,
  end_color: string,
  amount: number,
) {
  const scale = chroma
    .scale([begin_color, end_color])
    .mode("lch")
    .colors(amount);

  return scale;
}

export { colorSchameGenerator };
