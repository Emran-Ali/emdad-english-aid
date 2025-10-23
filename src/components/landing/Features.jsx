import Image from 'next/image';
import {SlPaperPlane} from 'react-icons/sl';

const Features = () => {
  return (
    <section className="relative py-4 overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="mb-20 md:max-w-xl text-center mx-auto">
          <h2 className="font-heading text-3xl sm:text-5xl lg:text-7xl text-cyan-500 tracking-tighter-xl">
            Features
          </h2>
        </div>
        <div
          className="relative mb-10 py-20 px-4 sm:px-16 bg-gradient-radial-dark overflow-hidden border border-gray-900 border-opacity-30 rounded-3xl">
          <div className="max-w-7xl  mx-auto">
            <div className="relative z-10 flex flex-wrap items-center -m-8">
              <div className="w-full md:w-1/2 p-8">
                <div className="max-w-md mx-auto text-center">
                  <h2 className="mb-6 text-3xl sm:text-6xl text-white tracking-tighter-xl">
                    Our features
                  </h2>
                  <ul>
                    <li className="items-center font-semibold text-lg sm:text-xl flex mb-6">
                      <SlPaperPlane className="text-lime-400" />
                      <p className="px-2 md:px-4 text-white text-opacity-60">
                        Air Condition Class room
                      </p>
                    </li>
                    <li className="items-center font-semibold text-xl flex mb-6">
                      <SlPaperPlane className="text-lime-400" />
                      <p className="px-2 md:px-4 text-white text-opacity-60">
                        Air Condition Class room
                      </p>
                    </li>
                    <li className="items-center font-semibold text-xl flex mb-6">
                      <SlPaperPlane className="text-lime-400" />
                      <p className="px-2 md:px-4 text-white text-opacity-60">
                        Air Condition Class room
                      </p>
                    </li>
                    <li className="items-center font-semibold text-xl flex mb-6">
                      <SlPaperPlane className="text-lime-400" />
                      <p className="px-2 md:px-4 text-white text-opacity-60">
                        Air Condition Class room
                      </p>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="w-full md:w-1/2 p-8">
                <div className="relative w-full h-[300px]">
                  <Image
                    className="mx-auto md:mr-0 rounded-3xl object-cover"
                    src="/assets/image/classroom.jpg"
                    alt="Classroom image"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-full">
            <Image
              src="/assets/template-images/features/bg-gray.png"
              alt="Background pattern"
              fill
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </div>
        <div className="flex flex-wrap -m-5">
          <div className="w-full md:w-1/2 p-5">
            <div
              className="relative px-4 sm:px-16 pt-14 pb-16 h-full bg-gradient-radial-dark overflow-hidden border border-gray-900 border-opacity-30 rounded-3xl">
              <div className="relative w-full h-[100px] mb-14">
                <Image
                  src="/assets/template-images/features/cards.png"
                  alt="Cards image"
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
              <div className="relative z-10 max-w-sm text-center mx-auto">
                <h2 className="mb-6 text-5xl text-white tracking-tighter">
                  Growing Number of Students with us
                </h2>
                <p className="text-white text-opacity-60">
                  It is a long established fact that a reader will be distracted
                  by the readable content of a page when looking at its layout.
                  The point of using Lorem Ipsum i
                </p>
              </div>
              <div className="absolute bottom-0 right-0 w-full h-full">
                <Image
                  src="/assets/template-images/features/bg-gray-2.png"
                  alt="Background pattern"
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 p-5">
            <div
              className="relative px-4 sm:px-16 pt-14 pb-16 h-full bg-gradient-radial-dark overflow-hidden border border-gray-900 border-opacity-30 rounded-3xl">
              <div className="mb-14 max-w-sm mx-auto">
                <div className="flex flex-wrap justify-center">
                  <div className="w-auto p-2">
                    <div className="relative h-28 w-28">
                      <Image
                        src="/assets/template-logos/un1.jpg"
                        className="rounded-lg"
                        alt="University logo 1"
                        fill
                        sizes="112px"
                      />
                    </div>
                  </div>
                  <div className="w-auto p-2">
                    <div className="relative h-28 w-28">
                      <Image
                        src="/assets/template-logos/un2.jpg"
                        className="rounded-lg"
                        alt="University logo 2"
                        fill
                        sizes="112px"
                      />
                    </div>
                  </div>
                  <div className="w-auto p-2">
                    <div className="relative h-28 w-28">
                      <Image
                        src="/assets/template-logos/un3.webp"
                        className="rounded-lg"
                        alt="University logo 3"
                        fill
                        sizes="112px"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative z-10 max-w-sm text-center mx-auto">
                <h2 className="mb-6 text-5xl text-white tracking-tighter">
                  Take a tour of our{' '}
                  <span className="text-lime-400">Study Abroad</span>{' '}
                  Consultation Center
                </h2>
                <p className="text-white text-opacity-60">
                  Explore the gateway to global education! <br />
                  We help students from Bangladesh achieve their dream of
                  studying at top universities around the world guiding you
                  every step of the way from university selection to visa
                  processing. Whether you're aiming for the{' '}
                  <span className="text-lime-400">
                    USA, UK, Canada, Australia, orEurope
                  </span>{' '}
                  our expert advisors are here to make your journey smooth and
                  successful.
                </p>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-full scale-x-[-1]">
                <Image
                  src="/assets/template-images/features/bg-gray-2.png"
                  alt="Background pattern"
                  fill
                  sizes="100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
