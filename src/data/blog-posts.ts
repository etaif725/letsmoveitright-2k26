import { COMPANY } from "@/data/company";

const BASE = COMPANY.domain;

export interface BlogPost {
  title: string;
  subtitle?: string;
  slug: string;
  href: string;
  excerpt: string;
  image?: string;
  seoTitle: string;
  seoDescription: string;
  canonical: string;
  content: string;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    title: "Timeline For Planning Your Move",
    subtitle: "Follow These Tips To Make Sure Your Move Goes Smoothly!",
    slug: "moving-checklist",
    href: "/blog/moving-checklist",
    excerpt:
      "Moving is a long and often complicated process. It's easy to get overwhelmed with everything; from getting quotes, hiring movers, and looking for or selling your home. This guide will tell you everything you need to do and when!",
    image: "/images/furniture-movers-360x240.jpg",
    seoTitle: `Timeline For Planning Your Move - ${COMPANY.shortName}`,
    seoDescription:
      "A complete timeline and checklist for planning your move. Follow these tips to make sure your move goes smoothly!",
    canonical: `${BASE}/blog/moving-checklist`,
    content: `
      <h2>2 Months Before Your Move</h2>
      <ul>
        <li><strong>Start calling your local movers!</strong> Even if you don't know the exact details of your move just yet, they are often happy to answer any questions you might have over the phone or even to schedule a walk-through of your home so you don't run into any surprises come move day.</li>
        <li>Start going through your home and deciding what needs to go and what doesn't. Anything that you can get rid of at this point equates to money you'll save on your move.</li>
        <li><strong>Stay organized!</strong> Keep track of all your moving quotes by keeping them in a &ldquo;moving binder&rdquo;. Having all your moving quotes in one place makes it easy to compare between companies.</li>
        <li>Moving schools can be one of the most stressful parts of a move. If you know where you're moving, it definitely helps to go to your child's school and arrange for their records to be transferred to the new school district.</li>
      </ul>

      <h2>6 Weeks Before</h2>
      <ul>
        <li><strong>Start ordering supplies.</strong> Even if you're not sure exactly what you need, start ordering your boxes, packing tape and paper as soon as possible. Even if you don't buy enough the first time, you'll have an idea of exactly what it will take to get the job done. You don't want to run out of supplies the night before your move!</li>
        <li>If you know the place you're moving in to, it helps to take measurements of the rooms and passageways in the home. With this you can determine if some pieces of furniture will need special attention to get them where you want them (or help you determine if you want to keep those items at all).</li>
      </ul>

      <h2>1 Month Before</h2>
      <ul>
        <li><strong>Book your move!</strong> The more time you give your mover to plan your move, the more time they have to make sure the trucks and men are available come move day. Be sure to get confirmation of your move day, the agreed upon rates, and any other specifics for your move.</li>
        <li><strong>Pack!</strong> Nothing is more stressful than having an unpacked house before move day. You can start packing the things that you don't use very often. Anything you can pack now just saves you time and frustration in the coming weeks. Don't forget to label your boxes! The more specific your labels, the easier it will be to unpack when you're in your new home.</li>
        <li><strong>Make the arrangements!</strong> Change your address at the local post office. This is usually enough to make sure that your mail and bills are forwarded to the right place, but if possible, it helps to ask a neighbor to keep an eye out for any mail still coming to your old home. Also, don't forget to notify banks, utilities, credit card companies, or anyone else who might need to know of your move.</li>
      </ul>

      <h2>2 Weeks Before</h2>
      <ul>
        <li><strong>Reconfirm your arrangements with your moving company.</strong> If something was lost in translation, it can still be squared away at this point. Also consider that if you're moving to another state, most interstate moving companies require 1-2 week notice before the pick-up date. If you've had a change of heart and want to go with a different company, now is the time to do it.</li>
        <li>If you're moving to a new climate, or if you're driving your own vehicle long distance, it helps to take your car into the shop to find out what issues you might possibly run into at your new home, or to find out if your car will make the journey with no issues.</li>
      </ul>

      <h2>A Few Days Before</h2>
      <ul>
        <li><strong>Arrange to have your appliances unhooked.</strong> Most movers won't do this for you on move day. If you plan on moving your fridge, remove all the food and defrost it at least 24 hours before move day.</li>
        <li>It doesn't hurt to call the moving company again to <strong>reconfirm the details</strong>! They should be more than happy to do so and to answer any last-minute questions you might have.</li>
        <li><strong>Make sure you can pay for the move!</strong> Most movers will not unload your belongings off their truck before payment has been received. If you can't pay and they end up having to move your stuff into storage, you can be stuck with a much larger bill than you were planning for.</li>
      </ul>

      <h2>Moving Day</h2>
      <ul>
        <li>Do a &ldquo;walk through&rdquo; with your crew leader before anyone touches a box so that they know what goes, what doesn't, and what general order everything should be loaded, saving &ldquo;last load&rdquo; items for the back of the truck.</li>
        <li>If possible, place carpet, floor and door frame protectors before the movers show up.</li>
        <li>If you've hired a good company, almost everything should be taken care of and you should feel like you're in good hands. With that said, it is still prudent to be vigilant during the entire move process, and pay special attention to the paperwork the movers have you sign on move day. If an inventory is being taken, make sure it is accurate and keep copies for yourself.</li>
        <li>Always do a final &ldquo;walk through&rdquo; with the crew leader to make sure that nothing was left behind.</li>
        <li>Call your move coordinator to let them know how everything went!</li>
      </ul>
    `,
  },
  {
    title: "Packing Tips For A Successful Move",
    subtitle: "Packing Tips to Help Your Move Go Off Without A Hitch!",
    slug: "packing-tips",
    href: "/blog/packing-tips",
    excerpt:
      "Proper packing is the key to a successful, damage-free move. Follow these easy tips and tricks to make sure your stuff shows up looking just like you left it.",
    image: "/images/packing-unpacking-360x240.jpg",
    seoTitle: `Packing Tips For A Successful Move - ${COMPANY.shortName}`,
    seoDescription:
      "Packing tips to help your move go off without a hitch. Follow these easy tips and tricks for a damage-free move.",
    canonical: `${BASE}/blog/packing-tips`,
    content: `
      <ul>
        <li><strong>Planning is key!</strong> Be sure to have the right boxes, and plenty of packing tape, paper, and pads. You don't want to realize you don't have enough supplies the night before your move, adding unneeded stress to an already stressful process. Give us a call and we can help you figure out what you might need, answer any questions you might have about packing specific items, or even set you up with our professional packing service.</li>
        <li><strong>Properly labeled boxes</strong> make the whole move process much easier from start to finish. With properly labeled boxes, you can easily keep track of your items, your movers can quickly and efficiently place your belongings in their desired rooms at the new home, and you can have easy access to things you might need right after the move.</li>
        <li><strong>Make sure your boxes are packed tightly.</strong> Any free space in the boxes for your items to move around in transit dramatically increases the chance that something may be broken. Pack any free spaces in the box tightly with crumpled up paper, linens, or clothes.</li>
        <li>Let us know if you have any <strong>antiques, paintings</strong>, or anything else that you think might need special care. Sometimes these items will have to have special &ldquo;crates&rdquo; made to secure them during transit.</li>
        <li><strong>Make sure your boxes are sealed tightly!</strong> Don't skimp on the tape! Saving money on a couple rolls of tape won't make a difference if even one of the boxes isn't taped up properly and breaks open.</li>
        <li>When packing breakables, be sure to <strong>individually wrap each item</strong> in the box. If you're packing dishes, <em>do not stack</em>, but put them in the box on their sides. You can bundle up individually wrapped breakables such as plates in order to keep them together when unpacking.</li>
        <li><strong>Use the right boxes for the right items.</strong> Use smaller boxes for heavier items like books, CDs, DVDs, or paper files. If you put these in larger boxes, they can get very heavy very quickly, which can make them unwieldy for yourself and the movers, or even cause the boxes to break under their own weight.</li>
        <li>If you're taking apart any of your own furniture before the move, it helps to <strong>tape any parts you might need for reassembly</strong> to the main base of the furniture. This just saves time and frustration at the other end of the move.</li>
        <li>If possible, <strong>use the original boxes</strong> for any electronics you may have, like computers, stereos, etc. If you don't have the original box with the foam inserts, then be sure to use lots of bubble wrap.</li>
        <li>It's always a good idea to <strong>pack and unpack your breakables on a padded surface</strong>. Nothing is worse than getting through a long move only to break your favorite piece of china when pulling it out of the box!</li>
        <li>Make an <strong>&ldquo;essentials&rdquo; box</strong>. Even after the move is done, it can be very stressful looking for that &ldquo;one thing you need&rdquo;. Put everything you might need into a single box and label it appropriately. It will make that first night in your new home much more enjoyable.</li>
      </ul>
      <p>If you follow these tips, you can rest easy knowing your belongings will show up just as you packed them.</p>
    `,
  },
  {
    title: "Commonly Used Terms By Moving Companies",
    slug: "moving-terms",
    href: "/blog/moving-terms",
    excerpt:
      "Every industry is filled with obscure (and sometimes confusing) lingo and the moving industry is no different. Read this helpful article so you can be sure you know exactly what we're talking about.",
    image: "/images/office-mover-360x240.jpg",
    seoTitle: `Commonly Used Terms By Moving Companies - ${COMPANY.shortName}`,
    seoDescription:
      "A glossary of commonly used terms by moving companies. Know what your mover is talking about with this helpful guide.",
    canonical: `${BASE}/blog/moving-terms`,
    content: `
      <p>Industry jargon can often sound like a foreign language to those outside the industry and the moving industry is no different. Below are some commonly used terms and phrases that you might run into during the move process. Whether you're talking with your move coordinator in the office or with your mover on move day, knowing these few terms can be very helpful with clearing up any confusion you might have.</p>

      <h2>Bill of Lading (BoL)</h2>
      <p>Your <em>Bill of Lading (BoL)</em> is the final contract for your move, which outlines the tariff rates, terms, and any additional charges for your move. It will typically be presented on the day your mover comes to load your belongings onto the truck. It's very important to read and understand your BoL and if you're confused about anything, don't hesitate to ask your crew leader or call the office to clear up any confusion.</p>

      <h2>Shuttle</h2>
      <p>A <em>shuttle</em> is often needed when there is limited access for large moving trucks around the property that you're moving into or out of. Most moving companies do have extra charges for the use of a shuttle, which serves to cover the costs of the extra truck, as well as the labor required to move things from the larger truck to the shuttle truck.</p>

      <h2>Full Pack and Unpack</h2>
      <p>Although packing services aren't typically a part of the basic move package offered by most companies, almost any moving company will happily arrange to pack your boxes for you. The &ldquo;full pack&rdquo; and &ldquo;full unpack&rdquo; means that you'll barely have to lift a finger for your move. We'll come out and safely package everything in the house for you, anything from pillows to fine china. There obviously are benefits to using a professional packing service, but if you have the time, packing your own boxes is an easy way to save money on your move.</p>

      <h2>Delivery Window</h2>
      <p>If you're moving locally, aside from very large moves, your pick up and delivery will all be done on the same day. If you're <em>not</em> moving locally, a <em>delivery window</em> is often needed. The window you're given will usually just consist of the first possible delivery date, and the last possible delivery date. For long distance moves, your mover will typically have more than one shipment on the truck. Coordinating deliveries between all these shipments is why your mover may need some leeway when it comes to the actual date that your goods are delivered. Be sure you're clear on what your agreed upon delivery window is with either your driver or their office staff before your movers show up to pick up your belongings.</p>
    `,
  },
  {
    title: "Choosing The Best Time Of Year To Move",
    slug: "best-time-make-move",
    href: "/blog/best-time-make-move",
    excerpt:
      "Sometimes we don't get to choose when we have to move. If we're lucky enough to be able to though, choosing the right time of year is important. Read this article to find out the best time of year to move on a budget.",
    image: "/images/Storage-Services-360x240.png",
    seoTitle: `Choosing The Best Time Of Year To Move - ${COMPANY.shortName}`,
    seoDescription:
      "Find out the best time of year to move on a budget. Learn about peak and non-peak moving seasons.",
    canonical: `${BASE}/blog/best-time-make-move`,
    content: `
      <p>Everyone knows that we don't always get to choose when we have to pick up our things and move. Depending on where you're moving, certain seasons can increase the risk of delays or complications during your move, like delays caused by snowstorms.</p>
      <p>The questions most people seem to have though is, &ldquo;When is the cheapest time to move?&rdquo;. Pricing can change for most moving companies depending on the time of the year, or even the time of the month, depending on how busy they are at the time. In the moving industry, we typically separate our year into a <em>non-peak</em> and a <em>peak</em> season, each taking up about half the year.</p>
      <p>The <em>non-peak season</em> is just the typically slower months, with the slowest months in the middle of winter. Most moving companies will lower their rates (or at least be willing to negotiate) in order to keep their trucks running and on the road through the slow season. These months will be the cheapest time of year for anyone to move and can sometimes be significantly cheaper, especially for long distance moves.</p>
      <p>The <em>peak season</em> is the busiest time of year for moving companies and usually starts around April and goes through the summer. Most moving companies have more requests for moves than they can possibly do, so will often raise their rates due to the increased demand. The peak season is busy for a reason; many people have kids and would rather not change schools during the middle of the school year. The weather also plays an important role in making the summer months the busiest time of year for moving companies, and the most expensive time of year to move. Generally favorable weather also makes moving during the summer preferable for most people. Nobody wants to move in the rain.</p>
      <p>If you're lucky enough to be flexible about your move date, consider moving during the slower months for moving companies. You might just find yourself with a little extra cash for yourself in your move budget.</p>
    `,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
