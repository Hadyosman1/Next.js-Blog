import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import bcrypt from "bcryptjs";
import { userLogInSchema } from "@/schemas/validationsSchemas";
import { ILogInUserDto } from "@/types/dtos";
import generateJWT from "@/utils/generateJWT";

/**
 * @method  POST
 * @route   ~/api/users/login
 * @desc    Login user
 * @access  public
 */
export async function POST(req: NextRequest) {
  try {
    const data = (await req.json()) as ILogInUserDto;

    const validation = userLogInSchema.safeParse(data);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: validation.error.errors[0].message,
          path: validation.error.errors[0].path[0],
        },
        {
          status: 400,
        },
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    const isAuthenticatedUser =
      user && (await bcrypt.compare(data.password, user.password));

    if (!isAuthenticatedUser) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 },
      );
    }

    const JWTPayload = {
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    };

    const token = generateJWT(JWTPayload);

    return NextResponse.json(
      { message: "Authenticated", token },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
